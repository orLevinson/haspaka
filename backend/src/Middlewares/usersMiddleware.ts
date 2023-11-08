import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// models
import HttpError from "../Models/http-error";
import UsersController from "../Models/usersController";
// types
import Request from "../Types/ExtendedRequest";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const usersController = new UsersController(next);
  const users = await usersController.getUsers();
  res.json({ success: true, body: users });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { username, password, name } = req.body;
  const usersController = new UsersController(next);

  const userWithTheSameName = await usersController.getUserByUsername(username);

  if (userWithTheSameName) {
    return next(
      new HttpError("There is already a user with the same username", 409)
    );
  }

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Registeration failed, please try again later.",
      500
    );
    return next(error);
  }

  const user = await usersController.addUser(username, hashedPassword, name);

  if (user) {
    delete user.password;
    let token: string;
    try {
      token = jwt.sign(
        {
          id: user.user_id,
        },
        process.env.JWT_KEY,
        { expiresIn: "1w" }
      );
      return res.json({ success: true, body: { ...user, token } });
    } catch (err) {
      const error = new HttpError(
        "Registeration failed, please try again later.",
        500
      );
      return next(error);
    }
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { username, password } = req.body;
  const usersController = new UsersController(next);

  const user = await usersController.getUserByUsername(username);

  if (!user) {
    return next(
      new HttpError("wrong credentials entered, please try again", 409)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("logging in failed, please try again", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "wrong credentials entered, please try again",
      401
    );
    return next(error);
  }

  delete user.password;

  if (user) {
    let token: string;
    try {
      token = jwt.sign(
        {
          id: user.user_id,
        },
        process.env.JWT_KEY,
        { expiresIn: "1w" }
      );
      return res.json({ success: true, body: { ...user, token } });
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const user_id = parseInt(req.params.uid);
  const command_id = parseInt(req.body.command_id);
  const usersController = new UsersController(next);
  const user = await usersController.updateUserCommand(user_id, command_id);
  if (user) {
    res.json({ success: true, body: user });
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const user_id = parseInt(req.params.uid);
  const usersController = new UsersController(next);
  const user = await usersController.deleteUser(user_id);
  res.json({ success: true, body: user });
};

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.userData;

  const usersController = new UsersController(next);

  const user = await usersController.getUserById(user_id);

  if (user) {
    const copy = { ...user };
    delete copy.password;
    res.json({
      success: true,
      body: user,
    });
  }
};

export { getUsers, register, login, updateUser, deleteUser, checkToken };
