// model imports
import DefaultController from "./defaultController";
// type imports
import { NextFunction } from "express";
import { Command } from "../Types/commands";

class CommandsController extends DefaultController<Command> {
  constructor(errCallback: NextFunction) {
    super({
      errCallback,
      table: "Commands",
      columns: ["command_name"],
      id_column: "command_id",
      joins: {},
    });
  }
}

export default CommandsController;
