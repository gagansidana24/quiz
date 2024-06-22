import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const { score } = location.state;

  return (
    <div>
      <h1>Your Score: {score}</h1>
      <Link to="/">Home</Link>
    </div>
  );
};

export default ResultPage;