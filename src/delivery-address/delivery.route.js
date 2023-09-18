import express from "express";
import multer from "multer";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";

import {
  getDeliveryAddress,
  store,
  update,
  destroy,
} from "./delivery.controller.js";

const router = express.Router();

// router.use(deserializeUser, requireUser);

router.get(
  "/delivery-addresses",
  deserializeUser,
  requireUser,
  multer().none(),
  getDeliveryAddress
);
router.post(
  "/delivery-address",
  deserializeUser,
  requireUser,
  multer().none(),
  store
);
router.put(
  "/delivery-address/:id",
  deserializeUser,
  requireUser,
  multer().none(),
  update
);
router.delete(
  "/delivery-address/:id",
  deserializeUser,
  requireUser,
  multer().none(),
  destroy
);

export default router;
