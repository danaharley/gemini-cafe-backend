import express from "express";
import multer from "multer";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";
import { restrictTo } from "../middleware/restrictTo.js";

import {
  destroy,
  getAllCategories,
  store,
  update,
} from "./category.controller.js";

const router = express.Router();

router.get("/categories", multer().none(), getAllCategories);

// router.use(deserializeUser, requireUser);

router.post(
  "/category",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  multer().none(),
  store
);
router.put(
  "/category/:id",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  multer().none(),
  update
);
router.delete(
  "/category/:id",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  destroy
);

export default router;
