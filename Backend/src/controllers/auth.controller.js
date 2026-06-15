const authService = require("../services/auth.service");

async function startAuth(req, res) {
  try {

    console.log("BODY RECEIVED:");
    console.log(req.body);

    const result =
      await authService.startAuth(req.body);

    console.log("SUCCESS");

    res.status(200).json(result);

  } catch (error) {

    console.error("AUTH ERROR:");
    console.error(error);

    res.status(400).json({
      error: error.message
    });

  }
}

module.exports = {
  startAuth
};