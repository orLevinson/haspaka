// model imports
import DefaultController from "./defaultController";
// type imports
import { NextFunction } from "express";
import { IdealInventory } from "../Types/idealInventory";

class IdealInventoryController extends DefaultController<IdealInventory> {
  constructor(errCallback: NextFunction) {
    super({
      errCallback,
      table: "Items",
      columns: ["item_id", "unit_id", "value"],
      id_column: "",
      joins: { Items: "item_id", Units: "unit_id" },
    });
  }

  async getByCommand(command_id: number){
    
  }

  async UpdateValue(item_id:number, unit_id:number){

  }
}

export default IdealInventoryController;
