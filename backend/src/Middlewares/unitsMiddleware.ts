import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import UnitsController from "../Models/unitsController";
// types
import Request from "../Types/ExtendedRequest";
// Random ID
import { v4 as uuid } from "uuid";

const getUnitsByCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Get all units'
  // #swagger.description = 'Get array of all the units joined with their commands name by permission(admins - all, command users - only units from their command) - Admin and command users'
  const unitsController = new UnitsController(next);
  let units: any;
  if (req.userData.command_name == "מנהלים") {
    units = await unitsController.getAll();
  } else {
    units = await unitsController.getByCommandId(req.userData.command_id);
  }
  if (units) {
    return res.json({ success: true, body: units });
  }
};

const addUnit = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Add unit'
  // #swagger.description = 'Creates a unit - Admin only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/addUnit"
                    }  
                }
            }
        } */
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
  // #swagger.summary = 'Update units command'
  // #swagger.description = 'Updates a unit command - Admin Only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/patchUnit"
                    }  
                }
            }
        } */
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
  // #swagger.summary = 'Delete unit'
  // #swagger.description = 'Deletes a unit, triggers a TRIGGER on the DB that deletes any row in any table that references this unit - Admins Only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/deleteUnits"
                    }  
                }
            }
        } */
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

export { getUnitsByCommand, addUnit, updateUnit, deleteUnits };
