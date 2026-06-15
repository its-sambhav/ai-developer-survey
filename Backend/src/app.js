const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const rateLimit =
    require("express-rate-limit");


const authRoutes = require("./routes/auth.routes");
const surveyRoutes = require("./routes/survey.routes");

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://ai-developer-survey.netlify.app"
        ],
        methods: ["GET", "POST"]
    })
);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false
    })
);
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", surveyRoutes);

module.exports = app;