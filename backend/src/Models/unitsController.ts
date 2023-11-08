// model imports
import DefaultController from "./defaultController";
// type imports
import { NextFunction } from "express";
import { Unit } from "../Types/units";

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
}

export default UnitsController;
