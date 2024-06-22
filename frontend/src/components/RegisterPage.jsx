import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/send-email-otp`, {
        email,
      });
      setEmailOtpSent(true);
      setErrorMessage("");
      setSuccessMessage("OTP sent to email");
    } catch (err) {
      setErrorMessage(err.response.data.message || "Failed to send OTP");
      setSuccessMessage("");
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        name,
        email,
        password,
        otp,
      });
      setErrorMessage("");
      setSuccessMessage("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setErrorMessage(err.response.data.message || "Registration failed");
      setSuccessMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>Register</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
      />
      {!emailOtpSent && (
        <button
          onClick={handleSendOtp}
          style={{
            padding: "10px",
            width: "100%",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Send OTP
        </button>
      )}
      {emailOtpSent && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
          />
          <button
            onClick={handleRegister}
            style={{
              padding: "10px",
              width: "100%",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
