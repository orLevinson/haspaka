// model imports
import DefaultController from "./defaultController";
// type imports
import { NextFunction } from "express";
import { Item } from "../Types/items";

class ItemsController extends DefaultController<Item> {
  constructor(errCallback: NextFunction) {
    super({
      errCallback,
      table: "Items",
      columns: ["item_name", "item_type"],
      id_column: "item_id",
      joins: {},
    });
  }
}

export default ItemsController;
