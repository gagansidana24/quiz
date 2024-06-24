import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ResultsQuiz = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { answers, quiz } = state;
  const navigate = useNavigate();

  let correctAnswers = 0;
  quiz.questions.forEach((question) => {
    if (answers[question._id] === question.correctAnswer) {
      correctAnswers += 1;
    }
  });

  return (
    <div>
      <h2>Quiz Results</h2>
      <p>
        You scored {correctAnswers} out of {quiz.questions.length}
      </p>
      <ul>
        {quiz.questions.map((question) => (
          <li key={question._id}>
            <p>{question.question}</p>
            <p>
              <strong>Your Answer:</strong>{" "}
              {answers[question._id] || "Not attempted"}
            </p>
            <p>
              <strong>Correct Answer:</strong> {question.correctAnswer}
            </p>
            <p>
              <strong>Option A:</strong> {question.a}
            </p>
            <p>
              <strong>Option B:</strong> {question.b}
            </p>
            <p>
              <strong>Option C:</strong> {question.c}
            </p>
            <p>
              <strong>Option D:</strong> {question.d}
            </p>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/home")}>Go to Home</button>
    </div>
  );
};

export default ResultsQuiz;
