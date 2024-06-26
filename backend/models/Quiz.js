const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  duration: { type: Number, required: true }, // Duration in minutes
  rules: { type: String, required: false }, // Quiz rules
});

module.exports = mongoose.model("Quiz", QuizSchema);
