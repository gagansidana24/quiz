const nodemailer = require("nodemailer");

const sendEmailOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Quiz App",
    text: `Your OTP for Quiz App is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmailOtp;
