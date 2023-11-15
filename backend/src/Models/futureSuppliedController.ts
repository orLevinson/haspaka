// type imports
import { NextFunction } from "express";
// inherit controller
import IdealInventoryController from "./idealInventoryController";
import { IdealInventory } from "../Types/idealInventory";
import HttpError from "./http-error";
import pool from "../Database/connectionToDB";

class FutureSuppliedController extends IdealInventoryController {
  constructor(errCallback: NextFunction) {
    super(errCallback);
    this.table = "future_supplied";
    this.columns = ["date", "item_id", "command_id", "value"];
    this.joins = { Items: "item_id", Commands: "command_id" };
  }

  async getByCommand(id: number) {
    let data: IdealInventory[];
    try {
      const { rows }: { rows: Array<IdealInventory> } = await pool.query(
        this.CreateJoinedQuery(
          `SELECT * FROM ${this.table} 
            WHERE command_id=$1
          `
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

  async UpdateValue(item_id: number, command_id: number, value: number) {
    let data: IdealInventory;
    try {
      const { rows }: { rows: Array<IdealInventory> } = await pool.query(
        this.CreateJoinedQuery(
          `UPDATE ${this.table}
            SET value=$1, date=$4
            WHERE item_id=$2 AND command_id=$3
            RETURNING *`
        ),
        [value, item_id, command_id, new Date()]
      );

      if (rows.length == 0) {
        console.log("didnt update anything");
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

export default FutureSuppliedController;
