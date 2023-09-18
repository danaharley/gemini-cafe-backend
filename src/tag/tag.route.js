import express from "express";
import multer from "multer";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";
import { restrictTo } from "../middleware/restrictTo.js";

import { destroy, getAlltags, store, update } from "./tag.controller.js";

const router = express.Router();

router.get("/tags", multer().none(), getAlltags);

// router.use(deserializeUser, requireUser);

router.post(
  "/tag",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  multer().none(),
  store
);
router.put(
  "/tag/:id",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  multer().none(),
  update
);
router.delete(
  "/tag/:id",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  multer().none(),
  destroy
);

export default router;
