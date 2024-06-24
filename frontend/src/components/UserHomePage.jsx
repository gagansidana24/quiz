import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserHomePage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [user, setUser] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user profile
        const userResponse = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userResponse.data);

        // Fetch quiz history
        const historyResponse = await axios.get(
          "http://localhost:3000/api/quiz/quiz-history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuizHistory(historyResponse.data);

        // Fetch quizzes
        const quizzesResponse = await axios.get(
          "http://localhost:3000/api/quiz/quizzes",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { category: selectedCategory },
          }
        );
        setQuizzes(quizzesResponse.data);

        // Extract unique categories
        if (categories.length === 1) {
          const uniqueCategories = Array.from(
            new Set(quizzesResponse.data.map((quiz) => quiz.category))
          );
          setCategories(["all", ...uniqueCategories]);
        }
      } catch (err) {
        console.error("Fetch User Data Error:", err);
      }
    };

    fetchUserData();
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
      {user && (
        <div>
          <h2>User Profile</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
      <h2>Quiz History</h2>
      <ul>
        {quizHistory.map((history) => (
          <li key={history._id}>
            <Link to={`/quiz-history/${history._id}`}>
              {history.quiz.title}
            </Link>{" "}
            - Score: {history.score}/{history.totalQuestions}
          </li>
        ))}
      </ul>
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
