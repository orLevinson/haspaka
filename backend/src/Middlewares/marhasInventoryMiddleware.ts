import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import MarhasInventoryController from "../Models/marhasInventoryController";
// types
import Request from "../Types/ExtendedRequest";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Get marhas inventory data'
  // #swagger.description = 'Get all the marhas inventory data - Admins only'
  const marhasInventoryController = new MarhasInventoryController(next);
  const marhasInventoryArray = await marhasInventoryController.getAll();
  if (marhasInventoryArray) {
    return res.json({ success: true, body: marhasInventoryArray });
  }
};

const addRecord = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Add empty records of marhas inventory'
  // #swagger.description = 'Creates for each item an empty record of marhas inventory - Admins only'
  const marhasInventoryController = new MarhasInventoryController(next);
  const emptyMarhasInventoryRecordArray =
    await marhasInventoryController.createRecord();
  if (emptyMarhasInventoryRecordArray) {
    return res.json({ success: true, body: emptyMarhasInventoryRecordArray });
  }
};

const changeValue = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Update a record value'
  // #swagger.description = 'Updates a marhas inventory record value based on its items id and date - Admins only'
  /*  #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/updateValueRecord"
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
  const { date, item_id, value } = req.body;
  const marhasInventoryController = new MarhasInventoryController(next);
  const marhasInventoryRecord = await marhasInventoryController.changeValue(
    new Date(date),
    item_id,
    value
  );
  if (marhasInventoryRecord) {
    return res.json({ success: true, body: marhasInventoryRecord });
  }
};

const deleteRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Delete record by date'
  // #swagger.description = 'Delete all the records of marhas inventory that belong to a certain date - Admins only'
  /*  #swagger.requestBody = {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/deleteRecord"
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
  const { date } = req.body;
  const marhasInventoryController = new MarhasInventoryController(next);
  const marhasInventoryRecord = await marhasInventoryController.deleteRecord(
    new Date(date)
  );
  if (marhasInventoryRecord) {
    return res.json({ success: true, body: marhasInventoryRecord });
  }
};

export { getAll, addRecord, changeValue, deleteRecord };
