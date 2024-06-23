import React, { useState } from "react";
import axios from "axios";

const SubmitData = () => {
  const [questionsJson, setQuestionsJson] = useState("");
  const [quizJson, setQuizJson] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuestionsSubmit = async () => {
    try {
      const questions = JSON.parse(questionsJson);
      await axios.post(
        "http://localhost:3000/api/quiz/submit-questions",
        questions,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Questions submitted successfully");
    } catch (err) {
      console.error(
        "Submit Questions Error:",
        err.response ? err.response.data : err.message
      );
      setErrorMessage(err.response ? err.response.data.message : err.message);
    }
  };

  const handleQuizSubmit = async () => {
    try {
      const quiz = JSON.parse(quizJson);
      await axios.post("http://localhost:3000/api/quiz/submit-quiz", quiz, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Quiz submitted successfully");
    } catch (err) {
      console.error(
        "Submit Quiz Error:",
        err.response ? err.response.data : err.message
      );
      setErrorMessage(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Submit Data</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div style={{ marginBottom: "20px" }}>
        <h2>Submit Questions JSON</h2>
        <textarea
          rows="10"
          cols="80"
          placeholder='[
  {
    "question": "What is the capital of France?",
    "a": "Berlin",
    "b": "Madrid",
    "c": "Paris",
    "d": "Rome",
    "correctAnswer": "c",
    "category": "Geography"
  },
  {
    "question": "What is 2 + 2?",
    "a": "3",
    "b": "4",
    "c": "5",
    "d": "6",
    "correctAnswer": "b",
    "category": "Mathematics"
  }
]'
          value={questionsJson}
          onChange={(e) => setQuestionsJson(e.target.value)}
        />
        <br />
        <button onClick={handleQuestionsSubmit}>Submit Questions</button>
      </div>

      <div>
        <h2>Submit Quiz JSON</h2>
        <textarea
          rows="10"
          cols="80"
          placeholder='{
  "title": "Sample Quiz",
  "questions": [
    {
      "question": "What is the capital of France?",
      "a": "Berlin",
      "b": "Madrid",
      "c": "Paris",
      "d": "Rome",
      "correctAnswer": "c",
      "category": "Geography"
    },
    "EXISTING_QUESTION_ID_1",
    {
      "question": "What is 2 + 2?",
      "a": "3",
      "b": "4",
      "c": "5",
      "d": "6",
      "correctAnswer": "b",
      "category": "Mathematics"
    },
    "EXISTING_QUESTION_ID_2"
  ]
}'
          value={quizJson}
          onChange={(e) => setQuizJson(e.target.value)}
        />
        <br />
        <button onClick={handleQuizSubmit}>Submit Quiz</button>
      </div>
    </div>
  );
};

export default SubmitData;
