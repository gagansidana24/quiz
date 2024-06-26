const express = require("express");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const QuizHistory = require("../models/QuizHistory");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Existing routes...

// Endpoint to submit a quiz
router.post(
  "/submit-quiz",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { title, category, duration, questions } = req.body;

    try {
      let questionIds = [];

      // Separate new questions and existing question IDs
      const newQuestions = questions.filter((q) => typeof q === "object");
      const existingQuestionIds = questions.filter(
        (q) => typeof q === "string"
      );

      // Insert new questions and get their IDs
      if (newQuestions.length > 0) {
        const questionDocs = await Question.insertMany(newQuestions);
        questionIds = questionDocs.map((q) => q._id);
      }

      // Verify that all existing question IDs exist in the database
      if (existingQuestionIds.length > 0) {
        const existingQuestions = await Question.find({
          _id: { $in: existingQuestionIds },
        });
        if (existingQuestions.length !== existingQuestionIds.length) {
          return res
            .status(400)
            .json({ message: "One or more question IDs do not exist" });
        }
        questionIds = [...questionIds, ...existingQuestionIds];
      }

      // Create quiz with question IDs
      const quiz = new Quiz({
        title,
        category,
        duration,
        questions: questionIds,
      });
      await quiz.save();

      res.status(201).json({ message: "Quiz submitted successfully", quiz });
    } catch (err) {
      console.error("Submit Quiz Error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// Endpoint to get quizzes
router.get("/quizzes", authMiddleware, async (req, res) => {
  const { category } = req.query;

  try {
    let quizzes;
    if (category && category !== "all") {
      quizzes = await Quiz.find({ category }).populate("questions");
    } else {
      quizzes = await Quiz.find().populate("questions");
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(quizzes);
  } catch (err) {
    console.error("Get Quizzes Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/// Endpoint to get a specific quiz by ID
router.get("/quizzes/:id", authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(quiz);
  } catch (err) {
    console.error("Get Quiz Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Endpoint to submit quiz answers and save history
router.post("/quizzes/:id/submit", authMiddleware, async (req, res) => {
  const { answers } = req.body;
  const { id: quizId } = req.params;
  const userId = req.user.id;

  try {
    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let correctAnswers = 0;
    const answerDetails = quiz.questions.map((question) => {
      const selectedOption = answers[question._id];
      const isCorrect = selectedOption === question.correctAnswer;
      if (isCorrect) {
        correctAnswers += 1;
      }
      return {
        question: question._id,
        selectedOption: selectedOption || "Not Attempted", // Allow partial submissions
        isCorrect,
      };
    });

    const quizHistory = new QuizHistory({
      user: userId,
      quiz: quiz._id,
      answers: answerDetails,
      score: correctAnswers,
      totalQuestions: quiz.questions.length,
    });

    await quizHistory.save();
    res
      .status(201)
      .json({ message: "Quiz results saved successfully", quizHistory });
  } catch (err) {
    console.error("Submit Quiz Answers Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Endpoint to get quiz history for a user
router.get("/quiz-history", authMiddleware, async (req, res) => {
  try {
    const history = await QuizHistory.find({ user: req.user.id })
      .populate("quiz")
      .populate("answers.question");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(history);
  } catch (err) {
    console.error("Get Quiz History Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Endpoint to get a specific quiz history by ID
router.get("/quiz-history/:id", authMiddleware, async (req, res) => {
  try {
    const history = await QuizHistory.findById(req.params.id)
      .populate("quiz")
      .populate("answers.question");
    if (!history) {
      return res.status(404).json({ message: "Quiz history not found" });
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(history);
  } catch (err) {
    console.error("Get Quiz History Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
