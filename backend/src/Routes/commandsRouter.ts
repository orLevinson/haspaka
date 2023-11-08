import express from "express";
import { check, param } from "express-validator";

import * as commandsMiddleware from "../Middlewares/commandsMiddleware";
import { getAuth, onlyAdmins } from "../Middlewares/authMiddleware";

const router = express.Router();

// from now on only for users with admin privilege
router.use(getAuth);
router.use(onlyAdmins);

router.get("/", commandsMiddleware.getCommands);

router.post(
  "/",
  [check("command_name").not().isEmpty(), check("command_name").isString()],
  commandsMiddleware.addCommand
);

router.patch(
  "/:cid",
  [
    check("command_name").not().isEmpty(),
    check("command_name").isString(),
    param("cid").not().isEmpty(),
    param("cid").isNumeric(),
  ],
  commandsMiddleware.updateCommand
);

router.delete(
  "/:cid",
  [param("cid").not().isEmpty(), param("cid").isNumeric()],
  commandsMiddleware.deleteCommand
);

export default router;
