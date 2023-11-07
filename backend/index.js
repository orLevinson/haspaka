require('dotenv').config();
const express = require("express");
var cors = require('cors');
const pg = require("pg");
const port = 5000;

// init postgres connection
const pool = new pg.Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: "haspaka",
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/units", async (req, res, next) => {
  const { rows } = await pool.query("SELECT * FROM Units");
  res.status(200).json(rows);
});

app.post('/updateUnit', async (req, res, next) => {
  const unitId = await pool.query(`
    UPDATE units SET unit_name='${req.body.unit_name}', command_id=${req.body.command_id} 
      WHERE unit_id=${req.body.unit_id} 
      RETURNING unit_id
  `);
  res.status(200).json(unitId);
});

app.listen(port, () => {
  console.log(`app started at port ${port}`);
});
