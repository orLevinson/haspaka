import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// models
import HttpError from "../Models/http-error";
import CommandsController from "../Models/commandsController";
// types
import Request from "../Types/ExtendedRequest";

const getCommands = async (req: Request, res: Response, next: NextFunction) => {
  const commandsController = new CommandsController(next);
  const commands = await commandsController.getAll();
  if (commands) {
    return res.json({ success: true, body: commands });
  }
};

const addCommand = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const commandsController = new CommandsController(next);
  const command = await commandsController.add({
    command_name: req.body.command_name,
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const command_id = parseInt(req.params.cid);
  const commandsController = new CommandsController(next);
  const command = await commandsController.delete(command_id);
  if (command) {
    return res.json({ success: true, body: command });
  }
};

export { getCommands, addCommand, updateCommand, deleteCommand };
