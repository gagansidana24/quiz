const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const sendEmailOtp = require("../utils/sendEmailOtp");

dotenv.config();

const router = express.Router();

// Utility function to generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs temporarily (for simplicity, in-memory storage)
const otpStorage = {};

router.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const emailOtp = generateOtp();
    otpStorage[email] = emailOtp; // Store OTP in memory for verification
    await sendEmailOtp(email, emailOtp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send Email OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password, otp } = req.body;

  try {
    // Check if the OTP matches
    if (otpStorage[email] !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password, emailVerified: true });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Remove OTP from storage after successful registration
    delete otpStorage[email];

    res.status(200).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
