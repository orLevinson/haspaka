import express from "express";
import { check } from "express-validator";

import * as inventoryTrackingMiddleware from "../Middlewares/inventoryTrackingMiddleware";
import { getAuth, onlyAdmins } from "../Middlewares/authMiddleware";

const router = express.Router();

// from now on only for users with admin privilege
router.use(getAuth);
router.use(onlyAdmins);
// make the swagger autogen know what tag are we on
router.use((_req, _res, next) => {
  // #swagger.tags = ['Inventory Tracking']
  next();
});

router.get("/", inventoryTrackingMiddleware.getAll);

router.post("/", inventoryTrackingMiddleware.recordData);

router.patch(
  "/",
  [
    check("date").not().isEmpty(),
    check("date")
      .isString()
      .custom((value: string) => {
        if (!isNaN(Date.parse(value))) {
          return true;
        }
        throw new Error("Isn't a date string");
      }),
    check("item_id").not().isEmpty(),
    check("item_id").isNumeric(),
    check("value").not().isEmpty(),
    check("value").isInt({ min: 0 }),
  ],
  inventoryTrackingMiddleware.changeValue
);

router.delete(
  "/",
  [
    check("date").not().isEmpty(),
    check("date")
      .isString()
      .custom((value: string) => {
        if (!isNaN(Date.parse(value))) {
          return true;
        }
        throw new Error("Isn't a date string");
      }),
  ],
  inventoryTrackingMiddleware.deleteRecord
);

export default router;
