import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import CommandsController from "../Models/commandsController";
// types
import Request from "../Types/ExtendedRequest";
// Random ID
import { v4 as uuid } from "uuid";

const getCommands = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Get all of the commands'
  // #swagger.description = 'Gets all of the commands and outputs them in array - Admins only'

  const commandsController = new CommandsController(next);
  const commands = await commandsController.getAll();
  if (commands) {
    return res.json({ success: true, body: commands });
  }
};

const addCommand = async (req: Request, res: Response, next: NextFunction) => {
  // #swagger.summary = 'Create new command'
  // #swagger.description = 'Creates new command and outputs its data - Admins only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/addCommand"
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

  let command_name = req.body.command_name;
  if (!command_name) {
    command_name = `פיקוד ${uuid()}`;
  }

  const commandsController = new CommandsController(next);
  const command = await commandsController.add({
    command_name,
  });
  if (command) {
    return res.json({ success: true, body: command });
  }
};

const updateCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Create new command'
  // #swagger.description = 'Creates new command and outputs its data - Admins only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/patchCommand"
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
  const command_id = parseInt(req.params.cid);
  const commandsController = new CommandsController(next);
  const command = await commandsController.update(command_id, {
    command_name: req.body.command_name,
  });
  if (command) {
    return res.json({ success: true, body: command });
  }
};

const deleteCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.summary = 'Delete existing command'
  // #swagger.description = 'Deletes existing commands and outputs their data,
  // also triggers a TRIGGER in the SQL that nullifies any reference to
  // the deleted commands in any other row of any other table - Admins only'
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/deleteCommand"
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

  const commandsController = new CommandsController(next);
  const commands = await commandsController.delete(req.body.commands_ids);
  if (commands) {
    return res.json({ success: true, body: commands });
  }
};

export { getCommands, addCommand, updateCommand, deleteCommand };
