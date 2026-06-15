const express = require("express");

const router = express.Router();

const verifyJWT = require("../middleware/auth");

const {
    startSurvey,
    submitSurvey
} = require("../controllers/survey.controller");

router.post(
    "/start-survey",
    verifyJWT,
    startSurvey
);

router.post(
    "/survey",
    verifyJWT,
    submitSurvey
);

module.exports = router;