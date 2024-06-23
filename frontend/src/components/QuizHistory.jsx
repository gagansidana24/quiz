import React, { useState, useEffect } from "react";
import axios from "axios";

const QuizHistory = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/quiz-history",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuizzes(response.data);
      } catch (err) {
        console.error("Fetch Quiz History Error:", err);
      }
    };

    fetchQuizHistory();
  }, []);

  return (
    <div>
      <h2>Quiz History</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>{quiz.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuizHistory;
