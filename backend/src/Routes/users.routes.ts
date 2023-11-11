import express from "express";
import { check, param } from "express-validator";

import * as usersMiddleware from "../Middlewares/usersMiddleware";
import { getAuth, onlyAdmins } from "../Middlewares/authMiddleware";

const router = express.Router();

// make the swagger autogen know what tag are we on
router.use((_req, _res, next) => {
  // #swagger.tags = ['Users']
  next();
});

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
  "",
  [
    check("users_ids").not().isEmpty(),
    check("users_ids").isArray(),
    check("users_ids.*").isNumeric(),
  ],
  usersMiddleware.deleteUsers
);

export default router;
