const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

const router = express.Router();

router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/quiz/:id/submit', authMiddleware, async (req, res) => {
  const { answers } = req.body;

  try {
    const quiz = await Quiz.findById(req.params.id);
    const score = answers.reduce((score, answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        score++;
      }
      return score;
    }, 0);

    const result = new Result({ userId: req.user.id, quizId: quiz.id, score });
    await result.save();
    res.json({ score });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;