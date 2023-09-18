import express from "express";
import upload from "../utils/upload.js";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";
import { restrictTo } from "../middleware/restrictTo.js";

import {
  destroy,
  getAllProducts,
  getSingleProduct,
  store,
  update,
} from "./product.controller.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProduct);

// router.use(deserializeUser, requireUser);

router.post(
  "/product",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  upload,
  store
);
router.put(
  "/product/:id",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  upload,
  update
);
router.delete(
  "/product/:id",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  destroy
);

export default router;
