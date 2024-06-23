import React, { useState, useEffect } from "react";
import axios from "axios";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/quiz/quizzes",
          {
            params: { category },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuizzes(response.data);
        if (categories.length === 0) {
          const allCategories = response.data.map((quiz) => quiz.category);
          setCategories(["all", ...new Set(allCategories)]);
        }
      } catch (err) {
        console.error("Fetch Quizzes Error:", err);
      }
    };

    fetchQuizzes();
  }, [category]);

  return (
    <div>
      <h1>Available Quizzes</h1>
      <label htmlFor="category">Filter by Category: </label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            {quiz.title} ({quiz.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quizzes;
