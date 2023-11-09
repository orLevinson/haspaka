import express from "express";
import { check } from "express-validator";

import * as givenSoFarMiddleware from "../Middlewares/givenSoFarMiddleware";
import { getAuth, onlyAdmins } from "../Middlewares/authMiddleware";

const router = express.Router();

// from now on only for users with admin privilege
router.use(getAuth);
router.use(onlyAdmins);
// make the swagger autogen know what tag are we on
router.use((_req, _res, next) => {
  // #swagger.tags = ['Given So Far']
  next();
});

router.get("/", givenSoFarMiddleware.getAll);

router.post("/", givenSoFarMiddleware.addRecord);

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
  givenSoFarMiddleware.changeValue
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
  givenSoFarMiddleware.deleteRecord
);

export default router;
