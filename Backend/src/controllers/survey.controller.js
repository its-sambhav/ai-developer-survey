async function startSurvey(req, res) {

    console.log(
        "JWT VERIFIED FOR:",
        req.user.email
    );

    res.status(200).json({
        success: true
    });

}

module.exports = {
    startSurvey
};