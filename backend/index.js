require('dotenv').config();
const express = require("express");
var cors = require('cors');
const pg = require("pg");
const port = 5000;

// init postgres connection
const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: "haspaka",
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/units", async (req, res, next) => {
  const { rows } = await pool.query('SELECT * FROM units');
  res.status(200).json(rows);
});

app.get("/commands", async (req, res, next) => {
  const { rows } = await pool.query('SELECT * FROM commands');
  res.status(200).json(rows);
});

app.get("/items", async (req, res, next) => {
  const { rows } = await pool.query('SELECT * FROM items');
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

app.post('/updateItem', async (req, res, next) => {
  const itemId = await pool.query(`
    UPDATE items SET item_name='${req.body.item_name}', item_type='${req.body.item_type}' 
      WHERE item_id=${req.body.item_id} 
      RETURNING item_id
  `);
  res.status(200).json(itemId);
});

app.post('/addUnit', async (req, res, next) => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const unitId = await pool.query(`
    INSERT INTO units(unit_name, command_id) VALUES ('${req.body.unit_name + randomNumber}', ${req.body.command_id}) 
      RETURNING unit_id
  `);
  res.status(200).json(unitId);
});

app.post('/removeUnits', async (req, res, next) => {
  if (!req.body.ids) {
    res.status(400).json("not selected rows");
    return;
  }
  const result = await pool.query(`DELETE FROM units WHERE unit_id IN (${req.body.ids})`);
  res.status(200).json(result);
});

app.post('/removeItems', async (req, res, next) => {
  if (!req.body.ids) {
    res.status(400).json("not selected rows");
    return;
  }
  const result = await pool.query(`DELETE FROM items WHERE item_id IN (${req.body.ids})`);
  res.status(200).json(result);
});

app.listen(port, () => {
  console.log(`app started at port ${port}`);
});

app.post('/addCommand', async (req, res, next) => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const commandId = await pool.query(`
    INSERT INTO commands(command_name) VALUES ('פיקוד ${randomNumber}') RETURNING command_id
    `);
  res.status(200).json(commandId);
});

app.post('/addItem', async (req, res, next) => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const itemId = await pool.query(`
    INSERT INTO items(item_name, item_type) VALUES ('פריט ${randomNumber}', 'שהייה') RETURNING item_id
    `);
  res.status(200).json(itemId);
});

app.post('/removeCommands', async (req, res, next) => {
  if (!req.body.ids) {
    res.status(400).json("not selected rows");
    return;
  }
  const result = await pool.query(`DELETE FROM commands WHERE command_id IN (${req.body.ids})`);
  res.status(200).json(result);
});