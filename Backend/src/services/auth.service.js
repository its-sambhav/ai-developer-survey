const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

async function startAuth(body) {

  console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("JWT SECRET:", process.env.JWT_SECRET);

  const { googleToken } = body;

  if (!googleToken) {
    throw new Error("Google token is required");
  }

  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  console.log("GOOGLE PAYLOAD:");
  console.log(payload);

  const {
    sub,
    email,
    name,
    email_verified
  } = payload;

  if (!email_verified) {
    throw new Error("Email not verified");
  }

  const token = jwt.sign(
    {
      google_sub: sub,
      email,
      name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h"
    }
  );

  return {
    success: true,
    token
  };
}

module.exports = {
  startAuth
};