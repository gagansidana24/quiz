import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResultsQuizHistory = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [quizHistory, setQuizHistory] = useState(
    state ? state.quizHistory : null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!quizHistory) {
      const fetchQuizHistory = async () => {
        try {
          console.log("Fetching quiz history with ID:", id);
          const response = await axios.get(
            `http://localhost:3000/api/quiz/quiz-history/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Quiz history fetched successfully:", response.data);
          setQuizHistory(response.data);
        } catch (err) {
          console.error("Fetch Quiz History Error:", err);
        }
      };
      fetchQuizHistory();
    }
  }, [id, quizHistory]);

  console.log("quizHistory:", quizHistory);

  if (!quizHistory) {
    return <div>Loading...</div>;
  }

  const { quiz, answers } = quizHistory;

  return (
    <div>
      <h2>Quiz Results</h2>
      <p>
        You scored {quizHistory.score} out of {quizHistory.totalQuestions}
      </p>
      <ul>
        {quiz.questions.map((question) => (
          <li key={question._id}>
            <p>{question.question}</p>
            <p>
              <strong>Your Answer:</strong>{" "}
              {answers.find((ans) => ans.question._id === question._id)
                ?.selectedOption || "Not attempted"}
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

export default ResultsQuizHistory;
