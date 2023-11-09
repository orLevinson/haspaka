import express from "express";
import { check } from "express-validator";

import * as marhasInventoryMiddleware from "../Middlewares/marhasInventoryMiddleware";
import { getAuth, onlyAdmins } from "../Middlewares/authMiddleware";

const router = express.Router();

// from now on only for users with admin privilege
router.use(getAuth);
router.use(onlyAdmins);
// make the swagger autogen know what tag are we on
router.use((_req, _res, next) => {
  // #swagger.tags = ['Marhas Inventory']
  next();
});

router.get("/", marhasInventoryMiddleware.getAll);

router.post("/", marhasInventoryMiddleware.addRecord);

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
  marhasInventoryMiddleware.changeValue
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
  marhasInventoryMiddleware.deleteRecord
);

export default router;
