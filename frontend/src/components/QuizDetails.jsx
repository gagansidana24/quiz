import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QuizDetails = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/quiz/quizzes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuiz(response.data);
      } catch (err) {
        console.error("Fetch Quiz Error:", err);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleStartQuiz = () => {
    setStarted(true);
    navigate(`/quiz/${id}/start`);
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>
        <strong>Category:</strong> {quiz.category}
      </p>
      <p>
        <strong>Duration:</strong> {quiz.duration} minutes
      </p>
      <p>
        <strong>Total Questions:</strong> {quiz.questions.length}
      </p>
      <p>
        <strong>Rules:</strong> {quiz.rules}
      </p>
      <button onClick={handleStartQuiz}>Start Quiz</button>
    </div>
  );
};

export default QuizDetails;
