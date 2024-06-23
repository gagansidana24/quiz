import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfile from "./UserProfile";
import QuizHistory from "./QuizHistory";

const UserHomePage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/quiz/quizzes",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: { category: selectedCategory },
          }
        );
        setQuizzes(response.data);

        if (categories.length === 1) {
          // Only 'all' is present initially
          const uniqueCategories = Array.from(
            new Set(response.data.map((quiz) => quiz.category))
          );
          setCategories(["all", ...uniqueCategories]);
        }
      } catch (err) {
        console.error("Fetch Quizzes Error:", err);
      }
    };

    fetchQuizzes();
  }, [selectedCategory]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <UserProfile />
      <QuizHistory />
      <h2>Available Quizzes</h2>
      <label htmlFor="categoryFilter">Filter by Category:</label>
      <select
        id="categoryFilter"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            <Link to={`/quiz/${quiz._id}`}>{quiz.title}</Link> ({quiz.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHomePage;
