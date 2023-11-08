import fs from "fs";
import path from "path";
import pool from "./connectionToDB";

const validateDB = () => {
  fs.readFile(
    path.join(__dirname, "schemaDB.sql"),
    "utf8",
    async (err: Error, data) => {
      if (err) {
        console.error("Error validating DB schema, reading sql file failed");
        return;
      }
      try {
        await pool.query("BEGIN");
        data.split("--").forEach(async (sql_statement) => {
          await pool.query(sql_statement);
        });
        await pool.query("END");
      } catch (err) {
        console.error(
          "Error validating DB schema, sending commands to the server failed"
        );
        return;
      }
    }
  );
  console.log("DB schema was validated successfully!");
  return 1;
};

export default validateDB;
