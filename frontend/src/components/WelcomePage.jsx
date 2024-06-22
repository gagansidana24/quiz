import React from "react";

const WelcomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1>Welcome, {user.name}!</h1>
    </div>
  );
};

export default WelcomePage;
