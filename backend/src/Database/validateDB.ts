import fs from "fs";
import path from "path";
import pool from "./connectionToDB";

const validateDB = () => {
  fs.readFile(
    path.join(process.cwd(), "shared", "schemaDB.sql"),
    "utf8",
    async (err: Error, data) => {
      if (err) {
        console.error("Error validating DB schema, reading sql file failed");
        return;
      }
      try {
        await pool.query("BEGIN");
        for (const sql_statement of data.split("--")) {
          await pool.query(sql_statement);
        }
        await pool.query("COMMIT");
      } catch (err) {
        await pool.query("ROLLBACK");
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
