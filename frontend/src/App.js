import React, { useContext, useEffect, useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import QuizPage from "./components/QuizPage";
import ResultPage from "./components/ResultPage";
import WelcomePage from "./components/WelcomePage";
import SubmitData from "./components/SubmitData";
import UserHomePage from "./components/UserHomePage";
import QuizDetails from "./components/QuizDetails";
import SubmitQuiz from "./components/SubmitQuiz";
import ReviewQuiz from "./components/ReviewQuiz";
import ResultsQuiz from "./components/ResultsQuiz";
import ResultsQuizHistory from "./components/ResultsQuizHistory";
import { TimerProvider } from "./context/TimerContext";
import axios from "axios";

const TimerWrapper = ({ Component }) => {
  const { id } = useParams();
  const [duration, setDuration] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();

  const fetchQuizData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/quiz/quizzes/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDuration(response.data.duration);
      setQuiz(response.data);
    } catch (err) {
      console.error("Fetch Quiz Data Error:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleTimeOut = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/quiz/quizzes/${id}/submit`,
        { answers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate(`/quiz/${id}/results`, { state: { answers, quiz } });
    } catch (err) {
      console.error("Submit Quiz Answers Error:", err);
    }
  };

  if (duration === null) {
    return <div>Loading...</div>;
  }

  return (
    <TimerProvider duration={duration} onTimeOut={handleTimeOut}>
      <Component setAnswers={setAnswers} quiz={quiz} />
    </TimerProvider>
  );
};

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
        <Route path="/quiz/:id" element={<QuizDetails />} />
        {/* <Route path="/quiz/:id/start" element={<SubmitQuiz />} />
        <Route path="/quiz/:id/review" element={<ReviewQuiz />} /> */}

        <Route
          path="/quiz/:id/start"
          element={<TimerWrapper Component={SubmitQuiz} />}
        />
        <Route
          path="/quiz/:id/review"
          element={<TimerWrapper Component={ReviewQuiz} />}
        />

        <Route path="/quiz/:id/results" element={<ResultsQuiz />} />
        <Route path="/quiz-history/:id" element={<ResultsQuizHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
