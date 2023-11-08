import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import UnitsController from "../Models/unitsController";
// types
import Request from "../Types/ExtendedRequest";
// Random ID
import { v4 as uuid } from "uuid";

const getUnits = async (req: Request, res: Response, next: NextFunction) => {
  const unitsController = new UnitsController(next);
  const units = await unitsController.getAll();
  if (units) {
    return res.json({ success: true, body: units });
  }
};

const addUnit = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let command_id = req.body.command_id;
  if (!command_id) {
    command_id = req.userData.command_id;
  }

  let unit_name = req.body.unit_name;
  if (!unit_name) {
    unit_name = `יחידה ${uuid()}`;
  }

  const unitsController = new UnitsController(next);
  const unit = await unitsController.add({
    unit_name,
    command_id: parseInt(command_id),
  });
  if (unit) {
    return res.json({ success: true, body: unit });
  }
};

const updateUnit = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const unit_id = parseInt(req.params.uid);
  const unitsController = new UnitsController(next);
  const unit = await unitsController.update(unit_id, {
    unit_name: req.body.unit_name,
    command_id: req.body.command_id,
  });
  if (unit) {
    return res.json({ success: true, body: unit });
  }
};

const deleteUnits = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const unitsController = new UnitsController(next);
  const units = await unitsController.delete(req.body.units_ids);
  if (units) {
    return res.json({ success: true, body: units });
  }
};

export { getUnits, addUnit, updateUnit, deleteUnits };
