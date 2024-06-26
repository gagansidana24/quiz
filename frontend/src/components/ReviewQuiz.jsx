import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TimerContext } from "../context/TimerContext";

const ReviewQuiz = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { answers, quiz } = state;
  const { timeLeft, setTimeLeft } = useContext(TimerContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const handleSubmitQuiz = async () => {
    setTimeLeft(0); // Stop the timer
    try {
      await axios.post(
        `http://localhost:3000/api/quiz/quizzes/${id}/submit`,
        { answers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate(`/quiz/${id}/results`, { state: { answers, quiz } });
    } catch (err) {
      console.error("Submit Quiz Answers Error:", err);
    }
  };

  return (
    <div>
      <h2>Review Quiz</h2>
      <p>
        Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
        {timeLeft % 60}
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
      <button
        onClick={() =>
          navigate(`/quiz/${id}/start`, { state: { answers, quiz } })
        }
      >
        Back to Quiz
      </button>
      <button onClick={handleSubmitQuiz}>Submit Quiz</button>
    </div>
  );
};

export default ReviewQuiz;
