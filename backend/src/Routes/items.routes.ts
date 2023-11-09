import express from "express";
import { check, param } from "express-validator";

import * as itemsMiddleware from "../Middlewares/itemsMiddleware";
import { getAuth, onlyAdmins } from "../Middlewares/authMiddleware";

const router = express.Router();

// from now on only for users with admin privilege
router.use(getAuth);
router.use(onlyAdmins);
// make the swagger autogen know what tag are we on
router.use((_req, _res, next) => {
  // #swagger.tags = ['Items']
  next();
});

router.get("/", itemsMiddleware.getItems);

router.post(
  "/",
  [
    check("item_name").isString().optional(),
    check("item_type")
      .custom((value) => {
        if (["שהייה", "חורף"].includes(value)) {
          return true;
        }
        throw new Error("Invalid Item Type");
      })
      .optional(),
  ],
  itemsMiddleware.addItem
);

router.patch(
  "/:iid",
  [
    check("item_name").isString().optional(),
    check("item_type")
      .custom((value) => {
        if (["שהייה", "חורף"].includes(value)) {
          return true;
        }
        throw new Error("Invalid Item Type");
      })
      .optional(),
    param("iid").not().isEmpty(),
    param("iid").isNumeric(),
  ],
  itemsMiddleware.updateItem
);

router.delete(
  "/",
  [
    check("items_ids").not().isEmpty(),
    check("items_ids").isArray(),
    check("items_ids.*").isNumeric(),
  ],
  itemsMiddleware.deleteItems
);

export default router;
