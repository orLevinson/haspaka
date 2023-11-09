import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import NeededInventoryController from "../Models/neededInventoryController";
// types
import Request from "../Types/ExtendedRequest";

const getItemsByCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Get items by command'
  // #swagger.description = 'Get items by the user command, admins get all the items'
  const command_id = req.userData.command_id;
  const neededInventoryController = new NeededInventoryController(next);
  const neededInventoryArray = await neededInventoryController.getByCommand(
    command_id
  );
  if (neededInventoryArray) {
    return res.json({ success: true, body: neededInventoryArray });
  }
};

const updateItemValue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Update a record's value'
  // #swagger.description = 'Updates a needed inventory record's value, can be done only if user has access to the unit's command or he is an admin'
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
  const neededInventoryController = new NeededInventoryController(next);
  const neededInventory = await neededInventoryController.UpdateValue(
    item_id,
    unit_id,
    value
  );
  if (neededInventory) {
    return res.json({ success: true, body: neededInventory });
  }
};

export { getItemsByCommand, updateItemValue };
