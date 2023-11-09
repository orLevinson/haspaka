// type imports
import { NextFunction } from "express";
// inherit controller
import IdealInventoryController from "./idealInventoryController";

class NeededInventoryController extends IdealInventoryController {
  constructor(errCallback: NextFunction) {
    super(errCallback);
    this.table = "needed_inventory";
  }
}

export default NeededInventoryController;
