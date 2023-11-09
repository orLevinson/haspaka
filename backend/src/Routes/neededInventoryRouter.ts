import express from "express";
import { check } from "express-validator";

import * as neededInventoryMiddleware from "../Middlewares/neededInventoryMiddleware";
import {
  getAuth,
  hasCommand,
  hasPermissionToUnit,
} from "../Middlewares/authMiddleware";

const router = express.Router();

// from now on only for users with command
router.use(getAuth);
router.use(hasCommand);
// make the swagger autogen know what tag are we on
router.use((_req, _res, next) => {
  // #swagger.tags = ['Needed Inventory']
  next();
});

router.get("/", neededInventoryMiddleware.getItemsByCommand);

router.patch(
  "/",
  [
    check("value").not().isEmpty(),
    check("value").isInt({ min: 0 }),
    check("unit_id").not().isEmpty(),
    check("unit_id").isNumeric(),
    check("item_id").not().isEmpty(),
    check("item_id").isNumeric(),
  ],
  hasPermissionToUnit,
  neededInventoryMiddleware.updateItemValue
);

export default router;
