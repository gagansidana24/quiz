import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SubmitQuiz = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [quiz, setQuiz] = useState(state ? state.quiz : null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(state ? state.answers : {});
  const navigate = useNavigate();

  useEffect(() => {
    if (!quiz) {
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
          setTimeLeft(response.data.duration * 60); // convert minutes to seconds
        } catch (err) {
          console.error("Fetch Quiz Error:", err);
        }
      };
      fetchQuiz();
    }
  }, [id, quiz]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleReviewQuiz = () => {
    navigate(`/quiz/${id}/review`, { state: { answers, quiz } });
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <p>
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
          {timeLeft % 60}
        </p>
        <div>
          <p>{quiz.questions[currentQuestionIndex].question}</p>
          <div>
            <input
              type="radio"
              id={`${quiz.questions[currentQuestionIndex]._id}-a`}
              name={quiz.questions[currentQuestionIndex]._id}
              value="a"
              checked={
                answers[quiz.questions[currentQuestionIndex]._id] === "a"
              }
              onChange={() =>
                handleAnswerChange(
                  quiz.questions[currentQuestionIndex]._id,
                  "a"
                )
              }
            />
            <label htmlFor={`${quiz.questions[currentQuestionIndex]._id}-a`}>
              {quiz.questions[currentQuestionIndex].a}
            </label>
          </div>
          <div>
            <input
              type="radio"
              id={`${quiz.questions[currentQuestionIndex]._id}-b`}
              name={quiz.questions[currentQuestionIndex]._id}
              value="b"
              checked={
                answers[quiz.questions[currentQuestionIndex]._id] === "b"
              }
              onChange={() =>
                handleAnswerChange(
                  quiz.questions[currentQuestionIndex]._id,
                  "b"
                )
              }
            />
            <label htmlFor={`${quiz.questions[currentQuestionIndex]._id}-b`}>
              {quiz.questions[currentQuestionIndex].b}
            </label>
          </div>
          <div>
            <input
              type="radio"
              id={`${quiz.questions[currentQuestionIndex]._id}-c`}
              name={quiz.questions[currentQuestionIndex]._id}
              value="c"
              checked={
                answers[quiz.questions[currentQuestionIndex]._id] === "c"
              }
              onChange={() =>
                handleAnswerChange(
                  quiz.questions[currentQuestionIndex]._id,
                  "c"
                )
              }
            />
            <label htmlFor={`${quiz.questions[currentQuestionIndex]._id}-c`}>
              {quiz.questions[currentQuestionIndex].c}
            </label>
          </div>
          <div>
            <input
              type="radio"
              id={`${quiz.questions[currentQuestionIndex]._id}-d`}
              name={quiz.questions[currentQuestionIndex]._id}
              value="d"
              checked={
                answers[quiz.questions[currentQuestionIndex]._id] === "d"
              }
              onChange={() =>
                handleAnswerChange(
                  quiz.questions[currentQuestionIndex]._id,
                  "d"
                )
              }
            />
            <label htmlFor={`${quiz.questions[currentQuestionIndex]._id}-d`}>
              {quiz.questions[currentQuestionIndex].d}
            </label>
          </div>
        </div>
      </div>
      <button
        onClick={handlePreviousQuestion}
        disabled={currentQuestionIndex === 0}
      >
        Previous
      </button>
      <button
        onClick={handleNextQuestion}
        disabled={currentQuestionIndex === quiz.questions.length - 1}
      >
        Next
      </button>
      <button onClick={handleReviewQuiz}>Review Quiz</button>
    </div>
  );
};

export default SubmitQuiz;
