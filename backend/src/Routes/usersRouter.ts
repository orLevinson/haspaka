import express from "express";
import { check, param } from "express-validator";

import * as usersMiddleware from "../Middlewares/usersMiddleware";
import { getAuth, onlyAdmins } from "../Middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/login",
  [
    check("username").not().isEmpty(),
    check("username").isString(),
    check("password").not().isEmpty(),
    check("password").isString(),
  ],
  usersMiddleware.login
);

router.post(
  "/register",
  [
    check("username").not().isEmpty(),
    check("username").isString(),
    check("name").not().isEmpty(),
    check("name").isString(),
    check("password").not().isEmpty(),
    check("password").isString(),
  ],
  usersMiddleware.register
);

router.use(getAuth);

router.get("/checkToken", usersMiddleware.checkToken);

// from here everything needs admin privileges
router.use(onlyAdmins);

router.get("/", usersMiddleware.getUsers);

router.patch(
  "/:uid",
  [
    param("uid").not().isEmpty(),
    param("uid").isNumeric(),
    check("command_id").not().isEmpty(),
    check("command_id").isNumeric(),
  ],
  usersMiddleware.updateUser
);

router.delete(
  "/:uid",
  [param("uid").not().isEmpty(), param("uid").isNumeric()],
  usersMiddleware.deleteUser
);

export default router;
