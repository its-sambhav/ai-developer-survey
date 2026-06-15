const pool = require("../database/pool");

async function submitSurvey(
    user,
    body,
    ipAddress
) {

    const {
        q1,
        q2,
        q3,
        q4,
        q5
    } = body;

    if (
        q1 == null ||
        q2 == null ||
        q3 == null ||
        q4 == null ||
        q5 == null
    ) {
        throw new Error(
            "All questions are required"
        );
    }

    const client =
        await pool.connect();

    try {

        await client.query("BEGIN");

        const {
            google_sub,
            email,
            name
        } = user;

        let userId;

        // Find existing user

        const existingUser =
            await client.query(
                `
                SELECT id
                FROM users
                WHERE google_sub = $1
                `,
                [google_sub]
            );

        if (
            existingUser.rows.length > 0
        ) {

            userId =
                existingUser.rows[0].id;

        } else {

            const newUser =
                await client.query(
                    `
                    INSERT INTO users
                    (
                        google_sub,
                        email,
                        name
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3
                    )
                    RETURNING id
                    `,
                    [
                        google_sub,
                        email,
                        name
                    ]
                );

            userId =
                newUser.rows[0].id;

        }

        // Check duplicate response

        const existingResponse =
            await client.query(
                `
                SELECT id
                FROM responses
                WHERE user_id = $1
                `,
                [userId]
            );


if (
    existingResponse.rows.length > 0
) {

    throw new Error(
        "Survey already submitted"
    );

}


        // Insert response

        await client.query(
            `
            INSERT INTO responses
            (
                user_id,
                q1,
                q2,
                q3,
                q4,
                q5
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
            `,
            [
                userId,
                q1,
                JSON.stringify(q2),
                JSON.stringify(q3),
                q4,
                q5
            ]
        );

        // Insert audit log

        await client.query(
            `
            INSERT INTO audit_logs
            (
                user_id,
                action,
                ip_address
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            `,
            [
                userId,
                "SURVEY_SUBMITTED",
                ipAddress
            ]
        );

        await client.query(
            "COMMIT"
        );

        return {
            success: true
        };

    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        client.release();

    }

}

module.exports = {
    submitSurvey
};