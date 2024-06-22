const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/api", quizRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
