const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");
const surveyRoutes = require("./routes/survey.routes");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", healthRoutes);
app.use("/api", surveyRoutes);
module.exports = app;