// type imports
import { NextFunction } from "express";
// inherits controller
import MarhasInventoryController from "./marhasInventoryController";

class GivenSoFarController extends MarhasInventoryController {
  constructor(errCallback: NextFunction) {
    super(errCallback);
    this.table = "given_so_far";
  }
}

export default GivenSoFarController;
