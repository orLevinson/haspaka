import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import GivenSoFarController from "../Models/givenSoFarController";
// types
import Request from "../Types/ExtendedRequest";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Get given so far data'
  // #swagger.description = 'Get all the given so far data - Admins only'
  const givenSoFarController = new GivenSoFarController(next);
  const givenSoFarArray = await givenSoFarController.getAll();
  if (givenSoFarArray) {
    return res.json({ success: true, body: givenSoFarArray });
  }
};

const addRecord = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Add empty records of given so far'
  // #swagger.description = 'Creates for each item an empty record of given so far - Admins only'
  const givenSoFarController = new GivenSoFarController(next);
  const emptyGivenSoFarRecordArray =
    await givenSoFarController.createRecord();
  if (emptyGivenSoFarRecordArray) {
    return res.json({ success: true, body: emptyGivenSoFarRecordArray });
  }
};

const changeValue = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Update a record value'
  // #swagger.description = 'Updates a given so far record value based on its items id and date - Admins only'
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
  const givenSoFarController = new GivenSoFarController(next);
  const givenSoFarRecord = await givenSoFarController.changeValue(
    new Date(date),
    item_id,
    value
  );
  if (givenSoFarRecord) {
    return res.json({ success: true, body: givenSoFarRecord });
  }
};

const deleteRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Delete record by date'
  // #swagger.description = 'Delete all the records of given so far that belong to a certain date - Admins only'
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
  const givenSoFarController = new GivenSoFarController(next);
  const givenSoFarRecord = await givenSoFarController.deleteRecord(
    new Date(date)
  );
  if (givenSoFarRecord) {
    return res.json({ success: true, body: givenSoFarRecord });
  }
};

export { getAll, addRecord, changeValue, deleteRecord };
