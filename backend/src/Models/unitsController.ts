// model imports
import DefaultController from "./defaultController";
// type imports
import { NextFunction } from "express";
import { Unit } from "../Types/units";
import HttpError from "./http-error";
// connection to DB imports
import pool from "../Database/connectionToDB";

class UnitsController extends DefaultController<Unit> {
  constructor(errCallback: NextFunction) {
    super({
      errCallback,
      table: "Units",
      columns: ["unit_name", "command_id"],
      id_column: "unit_id",
      joins: { Commands: "command_id" },
    });
  }

  async getByCommandId(id: number) {
    let data: Unit[];
    try {
      const { rows }: { rows: Array<Unit> } = await pool.query(
        this.CreateJoinedQuery(
          `SELECT * FROM ${this.table} WHERE command_id=$1`
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
}

export default UnitsController;
