const mongoose = require("mongoose");

const QuizHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      selectedOption: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  dateTaken: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizHistory", QuizHistorySchema);
