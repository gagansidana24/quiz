import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import QuizPage from "./components/QuizPage";
import ResultPage from "./components/ResultPage";
import WelcomePage from "./components/WelcomePage";
import SubmitData from "./components/SubmitData";
import UserHomePage from "./components/UserHomePage";
import ViewQuiz from "./components/ViewQuiz";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/submit-data" element={<SubmitData />} />
        <Route path="/home" element={<UserHomePage />} />
        <Route path="/quiz/:id" element={<ViewQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
