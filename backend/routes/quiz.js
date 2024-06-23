const express = require("express");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Endpoint to submit questions
router.post(
  "/submit-questions",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const questions = req.body.map((q) => ({ ...q }));

    try {
      const questionDocs = await Question.insertMany(questions);
      res.status(201).json({
        message: "Questions submitted successfully",
        questions: questionDocs,
      });
    } catch (err) {
      console.error("Submit Questions Error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// Endpoint to submit a quiz
router.post(
  "/submit-quiz",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { title, category, questions } = req.body;

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
      const quiz = new Quiz({ title, category, questions: questionIds });
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
    res.status(200).json(quizzes);
  } catch (err) {
    console.error("Get Quizzes Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Endpoint to get a specific quiz by ID
router.get("/quizzes/:id", authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (err) {
    console.error("Get Quiz Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
