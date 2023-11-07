const express = require("express");
const pg = require("pg");
const port = 5000;

// init postgres connection

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "haspaka",
  password: "password",
  port: 5432,
});

const app = express();

app.get("/", async (req, res, next) => {
  const {rows} = await pool.query("SELECT * FROM Units");
  res.status(200).json({ success: 1, body: rows });
});

app.listen(port, () => {
  console.log(`app started at port ${port}`);
});
