import express from "express";
import { check } from "express-validator";

import * as idealInventoryController from "../Middlewares/idealInventoryMiddleware";
import { getAuth, hasCommand, onlyAdmins } from "../Middlewares/authMiddleware";

const router = express.Router();

// from now on only for users with command
router.use(getAuth);
router.use(hasCommand);
// make the swagger autogen know what tag are we on
router.use((_req, _res, next) => {
  // #swagger.tags = ['Ideal Inventory']
  next();
});

router.get("/", idealInventoryController.getItemsByCommand);

router.use(onlyAdmins);

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
  idealInventoryController.updateItemValue
);

export default router;
