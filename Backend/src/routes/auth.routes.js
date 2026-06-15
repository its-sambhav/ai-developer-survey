const express = require("express");

const router = express.Router();

const {
  startAuth
} = require("../controllers/auth.controller");

router.post("/start", startAuth);

module.exports = router;