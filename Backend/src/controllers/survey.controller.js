const surveyService =
    require("../services/survey.service");

async function startSurvey(req, res) {

    console.log(
        "JWT VERIFIED FOR:",
        req.user.email
    );

    res.status(200).json({
        success: true
    });

}

async function submitSurvey(req, res) {

    try {

        const result =
            await surveyService.submitSurvey(
                req.user,
                req.body,
                req.ip
            );

        res.status(200).json(result);

    } catch (error) {

        console.error(error);

if (
    error.message ===
    "Survey already submitted"
) {

    return res.status(409).json({
        error: error.message
    });

}

return res.status(400).json({
    error: error.message
});

    }

}

module.exports = {
    startSurvey,
    submitSurvey
};