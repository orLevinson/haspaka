import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// models
import HttpError from "../Models/http-error";
import UsersController from "../Models/usersController";
import UnitsController from "../Models/unitsController";
// types
import { User } from "../Types/users";
import Request from "../Types/ExtendedRequest";

const getAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  /* #swagger.security = [{
            "bearerAuth": [],
            "apiKeyAuth": []
    }] */

  try {
    //on app.js we allow the attach so the Authorization header
    const token = req.headers.authorization.split(" ")[1]; // Authorization : 'Bearer TOKEN' //split give an array of 2 values [Bearer,TOKEN]
    //scenario 2 -> we succeed but what ever we have in there doesnt give us any token

    if (!token) {
      const error = new HttpError("Authentication failed", 403);
      return next(error);
    }
    //process.env.JWT_KEY is taken from nodemon.json
    const decodedToken = jwt.verify(token, process.env.JWT_KEY) as {
      id: number;
    };

    const usersController = new UsersController(next);

    let userData: void | User;
    if (decodedToken && decodedToken.id) {
      userData = await usersController.getById(decodedToken.id);
    }

    if (!userData || !userData.command_id) {
      const error = new HttpError("You are not authorized to view this", 403);
      return next(error);
    }

    delete userData.password;

    req.userData = userData;

    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 403);
    return next(error);
  }
};

const onlyAdmins = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (!req.userData) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
  if (req.userData.command_name != "מנהלים") {
    const error = new HttpError("You are not authorized to view this", 403);
    return next(error);
  }
  next();
};

const hasCommand = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (!req.userData) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
  if (!req.userData.command_name) {
    const error = new HttpError("You are not authorized to view this", 403);
    return next(error);
  }
  next();
};

const hasPermissionToUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  if (!req.userData) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }

  if (!req.userData.command_id) {
    const error = new HttpError(
      "You are not authorized to preform this action",
      403
    );
    return next(error);
  }

  const { unit_id } = req.body;
  if (!unit_id || typeof unit_id != "number") {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const unitsController = new UnitsController(next);
  const unit = await unitsController.getById(unit_id);

  if (
    (!unit || unit.command_id !== req.userData.command_id) &&
    req.userData.command_name !== "מנהלים"
  ) {
    const error = new HttpError(
      "You are not authorized to preform this action",
      403
    );
    return next(error);
  }

  next();
};

export { getAuth, onlyAdmins, hasCommand, hasPermissionToUnit };
