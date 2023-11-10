import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import IdealInventoryController from "../Models/idealInventoryController";
// types
import Request from "../Types/ExtendedRequest";

const getItemsByCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Get items by command'
  // #swagger.description = 'Get items by the user command, admins get all the items'
  const { command_id, command_name } = req.userData;
  const idealInventoryController = new IdealInventoryController(next);
  const idealInventoryArray =
    command_name == "מנהלים"
      ? await idealInventoryController.getAll()
      : await idealInventoryController.getByCommand(command_id);
  if (idealInventoryArray) {
    return res.json({ success: true, body: idealInventoryArray });
  }
};

const updateItemValue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Update a records value'
  // #swagger.description = 'Updates a ideal inventory records value - Admins only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/updateValue"
                    }  
                }
            }
        } 
    */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { unit_id, item_id, value } = req.body;
  const idealInventoryController = new IdealInventoryController(next);
  const idealInventory = await idealInventoryController.UpdateValue(
    item_id,
    unit_id,
    value
  );
  if (idealInventory) {
    return res.json({ success: true, body: idealInventory });
  }
};

export { getItemsByCommand, updateItemValue };
