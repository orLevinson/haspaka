import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import InventoryTrackingController from "../Models/inventoryTrackingController";
// types
import Request from "../Types/ExtendedRequest";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Get inventory tracking data'
  // #swagger.description = 'Get all the inventory tracking data - Admins only'
  const inventoryTrackingController = new InventoryTrackingController(next);
  const inventoryTrackingArray = await inventoryTrackingController.getAll();
  if (inventoryTrackingArray) {
    return res.json({ success: true, body: inventoryTrackingArray });
  }
};

const recordData = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Add records of inventory tracking'
  // #swagger.description = 'Creates for each item a record of inventory tracking - sum of all the units values of needed inventory - Admins only'
  const inventoryTrackingController = new InventoryTrackingController(next);
  const inventoryTrackingArray = await inventoryTrackingController.recordData();
  if (inventoryTrackingArray) {
    return res.json({ success: true, body: inventoryTrackingArray });
  }
};

const changeValue = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Update a record value'
  // #swagger.description = 'Updates a manually an inventory tracking record value based on its items id and date - Admins only'
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
  const inventoryTrackingController = new InventoryTrackingController(next);
  const inventoryTrackingRecord = await inventoryTrackingController.changeValue(
    new Date(date),
    item_id,
    value
  );
  if (inventoryTrackingRecord) {
    return res.json({ success: true, body: inventoryTrackingRecord });
  }
};

const deleteRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Delete record by date'
  // #swagger.description = 'Delete all the records of inventory tracking that belong to a certain date - Admins only'
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
  const inventoryTrackingController = new InventoryTrackingController(next);
  const inventoryTrackingRecord = await inventoryTrackingController.deleteRecord(
    new Date(date)
  );
  if (inventoryTrackingRecord) {
    return res.json({ success: true, body: inventoryTrackingRecord });
  }
};

export { getAll, recordData, changeValue, deleteRecord };
