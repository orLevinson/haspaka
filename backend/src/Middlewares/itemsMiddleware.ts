import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import ItemsController from "../Models/itemsController";
// types
import Request from "../Types/ExtendedRequest";
// Random ID
import { v4 as uuid } from "uuid";

const getItems = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Get all items'
  // #swagger.description = 'Get array of all the items - Admin only'
  const itemsController = new ItemsController(next);
  const items = await itemsController.getAll();
  if (items) {
    return res.json({ success: true, body: items });
  }
};

const addItem = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Add item'
  // #swagger.description = 'Creates an item - Admin only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/addItem"
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

  let item_name = req.body.item_name;
  if (!item_name) {
    item_name = `פריט ${uuid()}`;
  }

  let item_type = req.body.item_type;
  if (!item_type) {
    item_type = "חורף";
  }

  const itemsController = new ItemsController(next);
  const item = await itemsController.add({
    item_name,
    item_type,
  });
  if (item) {
    return res.json({ success: true, body: item });
  }
};

const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Update item'
  // #swagger.description = 'Updates an item - Admin Only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/patchItem"
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
  const item_id = parseInt(req.params.iid);
  const itemsController = new ItemsController(next);
  const item = await itemsController.update(item_id, {
    item_name: req.body.item_name,
    item_type: req.body.item_type,
  });
  if (item) {
    return res.json({ success: true, body: item });
  }
};

const deleteItems = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Delete item'
  // #swagger.description = 'Deletes an item, triggers a TRIGGER on the DB that deletes any row in any table that references this item - Admins Only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/deleteItems"
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

  const itemsController = new ItemsController(next);
  const items = await itemsController.delete(req.body.items_ids);
  if (items) {
    return res.json({ success: true, body: items });
  }
};

export { getItems, addItem, updateItem, deleteItems };
