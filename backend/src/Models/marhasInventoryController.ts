// model imports
import HttpError from "./http-error";
// type imports
import { NextFunction } from "express";
import { InventoryTracking } from "../Types/inventoryTracking";
// DB imports
import pool from "../Database/connectionToDB";
// inherits controller
import InventoryTrackingController from "./inventoryTrackingController";

class MarhasInventoryController extends InventoryTrackingController {
  constructor(errCallback: NextFunction) {
    super(errCallback);
    this.table = "marhas_inventory";
  }

  async createRecord() {
    let data: InventoryTracking[];
    try {
      const { rows }: { rows: Array<InventoryTracking> } = await pool.query(
        this.CreateJoinedQuery(
          `INSERT INTO ${this.table}(date, item_id, value)
          SELECT (to_timestamp(${Date.now()} / 1000.0)),i.item_id, 0
          FROM Items AS i RETURNING *`
        ),
        []
      );

      data = rows.map((row) => ({ ...row, date: new Date(row.date) }));
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("An error occured while adding data", 500)
      );
    }
  }
}

export default MarhasInventoryController;
