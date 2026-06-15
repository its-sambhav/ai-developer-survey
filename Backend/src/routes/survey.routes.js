const express = require("express");

const router = express.Router();

const verifyJWT =
    require("../middleware/auth");

const {
    startSurvey
} = require("../controllers/survey.controller");

router.post(
    "/start-survey",
    verifyJWT,
    startSurvey
);

module.exports = router;