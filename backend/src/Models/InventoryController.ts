// model imports
import DefaultController from "./defaultController";
import HttpError from "./http-error";
// type imports
import { NextFunction } from "express";
import { IdealInventory } from "../Types/idealInventory";
// DB imports
import pool from "../Database/connectionToDB";

class IdealInventoryController extends DefaultController<IdealInventory> {
  constructor(errCallback: NextFunction) {
    super({
      errCallback,
      table: "ideal_inventory",
      columns: ["item_id", "unit_id", "value"],
      id_column: "",
      joins: { Items: "item_id", Units: "unit_id" },
    });
  }

  async getByCommand(id: number) {
    let data: IdealInventory[];
    try {
      const { rows }: { rows: Array<IdealInventory> } = await pool.query(
        this.CreateJoinedQuery(
          `SELECT * FROM ${this.table} 
            WHERE unit_id IN (
              SELECT unit_id FROM Commands
              WHERE command_id=$1
              )`
        ),
        [id]
      );

      data = rows;
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("An error occured while fetching data", 500)
      );
    }
  }

  async UpdateValue(item_id: number, unit_id: number, value: number) {
    let data: IdealInventory;
    try {
      const { rows }: { rows: Array<IdealInventory> } = await pool.query(
        this.CreateJoinedQuery(
          `UPDATE ${this.table}
            SET value=$1
            WHERE item_id=$2 AND unit_id=$3
            RETURNING *`
        ),
        [value, item_id, unit_id]
      );

      if (rows.length == 0) {
        throw new Error();
      }

      data = rows[0];
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("An error occured while uploading data", 500)
      );
    }
  }
}

export default IdealInventoryController;
