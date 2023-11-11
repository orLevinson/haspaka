import express from "express";
import { check, param } from "express-validator";

import * as unitsMiddleware from "../Middlewares/unitsMiddleware";
import { getAuth, onlyAdmins, hasCommand } from "../Middlewares/authMiddleware";

const router = express.Router();

// from now on only for users with admin privilege
router.use(getAuth);
router.use(hasCommand);
// make the swagger autogen know what tag are we on
router.use((_req, _res, next) => {
  // #swagger.tags = ['Units']
  next();
});

router.get("/", unitsMiddleware.getUnitsByCommand);

router.use(onlyAdmins);

router.post(
  "/",
  [
    check("unit_name").isString().optional(),
    check("command_id").isNumeric().optional(),
  ],
  unitsMiddleware.addUnit
);

router.patch(
  "/:uid",
  [
    check("command_name").isString().optional(),
    check("command_id").isNumeric().optional(),
    param("uid").not().isEmpty(),
    param("uid").isNumeric(),
  ],
  unitsMiddleware.updateUnit
);

router.delete(
  "/",
  [
    check("units_ids").not().isEmpty(),
    check("units_ids").isArray(),
    check("units_ids.*").isNumeric(),
  ],
  unitsMiddleware.deleteUnits
);

export default router;
