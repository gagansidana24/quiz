const express = require("express");
const User = require("../models/User");
const Quiz = require("../models/Quiz");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Endpoint to get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to get user's quiz history
router.get("/quiz-history", authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.id }).populate(
      "questions"
    );
    res.status(200).json(quizzes);
  } catch (err) {
    console.error("Get Quiz History Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
