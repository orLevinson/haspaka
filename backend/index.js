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

app.get("/idealInventory", async (req, res, next) => {
  const { rows } = await pool.query('SELECT * FROM ideal_Inventory');
  res.status(200).json(rows);
});

app.patch('/idealInventory', async (req, res, next) => {
  const value = await pool.query(`
    UPDATE ideal_Inventory SET value=${req.body.value}
      WHERE unit_id=${req.body.unit_id} AND item_id=${req.body.item_id}
      RETURNING value
  `);
  res.status(200).json(value);
});

app.get("/futureSupplied", async (req, res, next) => {
  const { rows } = await pool.query('SELECT * FROM Future_Supplied');
  res.status(200).json(rows);
});

app.get("/givenSoFar", async (req, res, next) => {
  const { rows } = await pool.query('SELECT * FROM Given_So_Far');
  res.status(200).json(rows);
});

app.get("/neededInventory", async (req, res, next) => {
  const { rows } = await pool.query('SELECT * FROM Needed_Inventory');
  res.status(200).json(rows);
});

app.get("/marhasInventory", async (req, res, next) => {
  const { rows } = await pool.query('SELECT * FROM Marhas_Inventory');
  res.status(200).json(rows);
});

app.patch('/neededInventory', async (req, res, next) => {
  console.log(req.body);
  const value = await pool.query(`
    UPDATE Needed_Inventory SET value=${req.body.value}
      WHERE date=$1 AND item_id=${req.body.item_id}
      RETURNING value
  `, [req.body.date]);
  res.status(200).json(value);
});

app.patch('/marhasInventory', async (req, res, next) => {
  console.log(req.body);
  const value = await pool.query(`
    UPDATE Marhas_Inventory SET value=${req.body.value}
      WHERE date=$1 AND item_id=${req.body.item_id}
      RETURNING value
  `, [req.body.date]);
  res.status(200).json(value);
});

app.patch('/givenSoFar', async (req, res, next) => {
  console.log(req.body);
  const value = await pool.query(`
    UPDATE given_so_far SET value=${req.body.value}
      WHERE date=$1 AND item_id=${req.body.item_id}
      RETURNING value
  `, [req.body.date]);
  res.status(200).json(value);
});

app.patch('/futureSupplied', async (req, res, next) => {
  const value = await pool.query(`
    UPDATE Future_Supplied SET value=${req.body.value}
      WHERE unit_id=${req.body.unit_id} AND item_id=${req.body.item_id}
      RETURNING value
  `);
  res.status(200).json(value);
});

app.patch('/units', async (req, res, next) => {
  const unitId = await pool.query(`
    UPDATE units SET unit_name='${req.body.unit_name}', command_id=${req.body.command_id} 
      WHERE unit_id=${req.body.unit_id} 
      RETURNING unit_id
  `);
  res.status(200).json(unitId);
});

app.patch('/items', async (req, res, next) => {
  const itemId = await pool.query(`
    UPDATE items SET item_name='${req.body.item_name}', item_type='${req.body.item_type}' 
      WHERE item_id=${req.body.item_id} 
      RETURNING item_id
  `);
  res.status(200).json(itemId);
});

app.post('/units', async (req, res, next) => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const unitId = await pool.query(`
    INSERT INTO units(unit_name, command_id) 
      SELECT 'אוגדה ${randomNumber}', command_id FROM commands LIMIT 1
      RETURNING unit_id
  `);
  res.status(200).json(unitId);
});

app.delete('/units', async (req, res, next) => {
  if (!req.body.ids) {
    res.status(400).json("not selected rows");
    return;
  }
  const result = await pool.query(`DELETE FROM units WHERE unit_id IN (${req.body.ids})`);
  res.status(200).json(result);
});

app.delete('/items', async (req, res, next) => {
  console.log(req.body);
  if (!req.body.ids) {
    res.status(400).json("not selected rows");
    return;
  }
  const result = await pool.query(`DELETE FROM items WHERE item_id IN (${req.body.ids})`);
  res.status(200).json(result);
});



app.post('/items', async (req, res, next) => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const itemId = await pool.query(`
    INSERT INTO items(item_name, item_type) VALUES ('פריט ${randomNumber}', 'שהייה') RETURNING item_id
    `);
  res.status(200).json(itemId);
});

app.delete('/commands', async (req, res, next) => {
  if (!req.body.ids) {
    res.status(400).json("not selected rows");
    return;
  }
  const result = await pool.query(`DELETE FROM commands WHERE command_id IN (${req.body.ids})`);
  res.status(200).json(result);
});

app.post('/commands', async (req, res, next) => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const commandId = await pool.query(`
    INSERT INTO commands(command_name) VALUES ('פיקוד ${randomNumber}') RETURNING command_id
    `);
  res.status(200).json(commandId);
});



app.listen(port, () => {
  console.log(`app started at port ${port}`);
});