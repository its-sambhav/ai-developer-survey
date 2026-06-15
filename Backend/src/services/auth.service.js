const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const pool = require("../database/pool");

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

async function startAuth(body) {

    const { googleToken } = body;

    if (!googleToken) {
        throw new Error(
            "Google token is required"
        );
    }

    const ticket =
        await client.verifyIdToken({
            idToken: googleToken,
            audience:
                process.env.GOOGLE_CLIENT_ID
        });

    const payload =
        ticket.getPayload();

    const {
        sub,
        email,
        name,
        email_verified
    } = payload;

    if (!email_verified) {
        throw new Error(
            "Email not verified"
        );
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

    const existingSubmission =
        await pool.query(
            `
            SELECT u.id
            FROM users u
            JOIN responses r
            ON u.id = r.user_id
            WHERE u.google_sub = $1
            `,
            [sub]
        );

    const alreadySubmitted =
        existingSubmission.rows.length > 0;

    return {
        success: true,
        token,
        alreadySubmitted
    };

}

module.exports = {
    startAuth
};