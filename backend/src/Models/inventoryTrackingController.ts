// model imports
import DefaultController from "./defaultController";
import HttpError from "./http-error";
// type imports
import { NextFunction } from "express";
import { InventoryTracking } from "../Types/inventoryTracking";
// DB imports
import pool from "../Database/connectionToDB";
import { Console } from "console";

class InventoryTrackingController extends DefaultController<InventoryTracking> {
  constructor(errCallback: NextFunction) {
    super({
      errCallback,
      table: "inventory_tracking",
      columns: ["date", "item_id", "value"],
      id_column: "",
      joins: { items: "item_id" },
    });
  }

  async recordData() {
    let data: InventoryTracking[];
    try {
      const { rows }: { rows: Array<InventoryTracking> } = await pool.query(
        this.CreateJoinedQuery(
          `INSERT INTO ${this.table}(date, item_id, value)
          SELECT (to_timestamp(${Date.now()} / 1000.0)),i.item_id, SUM(i.value)
          FROM Needed_Inventory AS i GROUP BY i.item_id RETURNING *`
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

  async changeValue(date: Date, item_id: number, value: number) {
    let data: InventoryTracking;
    try {
      let { rows }: { rows: Array<InventoryTracking> } = await pool.query(
        this.CreateJoinedQuery(
          `
             UPDATE ${this.table}
              SET value = $1
              WHERE date = to_timestamp($2 / 1000.0) AND item_id = $3
              RETURNING *
          `
        ),
        [value, date.getTime(), item_id]
      );

      if (rows.length == 0) {
        let { rows: insertedRows }: { rows: Array<InventoryTracking> } =
          await pool.query(
            this.CreateJoinedQuery(
              `
               INSERT INTO ${this.table}(date, item_id, value)
               VALUES ((to_timestamp($2 / 1000.0)),$3, $1)
               RETURNING *
            `
            ),
            [value, date.getTime(), item_id]
          );
        rows = insertedRows;
      }
      data = { ...rows[0], date: new Date(rows[0].date) };

      return data;
    } catch (error) {
      console.error(error);
      return this.errCallback(
        new HttpError("An error occured while updating data", 500)
      );
    }
  }

  async deleteRecord(date: Date) {
    let data: InventoryTracking[];
    try {
      const { rows }: { rows: Array<InventoryTracking> } = await pool.query(
        this.CreateJoinedQuery(
          `DELETE FROM ${this.table}
          WHERE date=(to_timestamp( $1 / 1000.0)) 
          RETURNING *`
        ),
        [date.getTime()]
      );

      data = rows.map((row) => ({ ...row, date: new Date(row.date) }));
      return data;
    } catch (error) {
      return this.errCallback(
        new HttpError("An error occured while deleting data", 500)
      );
    }
  }
}

export default InventoryTrackingController;
