require("dotenv").config();

const pool = require("./database/pool");
const app = require("./app");

const PORT = process.env.PORT || 10000;

async function startServer() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("Database Connected ✅");
    console.log(result.rows[0]);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database Connection Failed ❌");
    console.error(error);
  }
}

startServer();