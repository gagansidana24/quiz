const twilio = require("twilio");

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

const sendSmsOtp = async (mobile, otp) => {
  console.log(`Mock SMS sent to ${mobile}: Your OTP for Quiz App is ${otp}`);
  //   await client.messages.create({
  //     body: `Your OTP for Quiz App is ${otp}`,
  //     from: process.env.TWILIO_PHONE_NUMBER,
  //     to: mobile,
  //   });
};

module.exports = sendSmsOtp;
