import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

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

  const handleChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    // Handle the quiz submission logic here
    alert("Quiz submitted");
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.questions.map((question) => (
        <div key={question._id}>
          <p>{question.question}</p>
          <div>
            <input
              type="radio"
              id={`${question._id}-a`}
              name={question._id}
              value="a"
              onChange={() => handleChange(question._id, "a")}
            />
            <label htmlFor={`${question._id}-a`}>{question.a}</label>
          </div>
          <div>
            <input
              type="radio"
              id={`${question._id}-b`}
              name={question._id}
              value="b"
              onChange={() => handleChange(question._id, "b")}
            />
            <label htmlFor={`${question._id}-b`}>{question.b}</label>
          </div>
          <div>
            <input
              type="radio"
              id={`${question._id}-c`}
              name={question._id}
              value="c"
              onChange={() => handleChange(question._id, "c")}
            />
            <label htmlFor={`${question._id}-c`}>{question.c}</label>
          </div>
          <div>
            <input
              type="radio"
              id={`${question._id}-d`}
              name={question._id}
              value="d"
              onChange={() => handleChange(question._id, "d")}
            />
            <label htmlFor={`${question._id}-d`}>{question.d}</label>
          </div>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
};

export default ViewQuiz;
