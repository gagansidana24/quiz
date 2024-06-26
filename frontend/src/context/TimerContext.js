import React, { createContext, useState, useEffect, useCallback } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children, duration, onTimeOut }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = sessionStorage.getItem("timeLeft");
    return savedTime ? JSON.parse(savedTime) : duration * 60;
  });

  useEffect(() => {
    sessionStorage.setItem("timeLeft", JSON.stringify(timeLeft));
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      onTimeOut();
    }
  }, [timeLeft, onTimeOut]);

  return (
    <TimerContext.Provider value={{ timeLeft, setTimeLeft }}>
      {children}
    </TimerContext.Provider>
  );
};
