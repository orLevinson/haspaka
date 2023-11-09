// type imports
import { NextFunction } from "express";
// inherit controller
import IdealInventoryController from "./idealInventoryController";

class FutureSuppliedController extends IdealInventoryController {
  constructor(errCallback: NextFunction) {
    super(errCallback);
    this.table = "future_supplied";
  }
}

export default FutureSuppliedController;
