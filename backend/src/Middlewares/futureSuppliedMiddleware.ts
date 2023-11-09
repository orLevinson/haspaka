import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import FutureSuppliedController from "../Models/futureSuppliedController";
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
  const futureSuppliedController = new FutureSuppliedController(next);
  const futureSuppliedArray = await futureSuppliedController.getByCommand(
    command_id
  );
  if (futureSuppliedArray) {
    return res.json({ success: true, body: futureSuppliedArray });
  }
};

const updateItemValue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Update a record's value'
  // #swagger.description = 'Updates a future supplied record's value, can be done only if user has access to the unit's command or he is an admin'
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
  const futureSuppliedController = new FutureSuppliedController(next);
  const futureSupplied = await futureSuppliedController.UpdateValue(
    item_id,
    unit_id,
    value
  );
  if (futureSupplied) {
    return res.json({ success: true, body: futureSupplied });
  }
};

export { getItemsByCommand, updateItemValue };
