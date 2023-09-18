import express from "express";
import multer from "multer";
import { restrictTo } from "../middleware/restrictTo.js";
import { requireUser } from "../middleware/requireUser.js";
import { deserializeUser } from "../middleware/deserializeUser.js";

import {
  getPaymentChannels,
  getPaymentChannel,
  store,
  update,
} from "./payChannel.controller.js";

const router = express.Router();

// router.use(deserializeUser, requireUser);

router.get(
  "/payment-channels",
  deserializeUser,
  requireUser,
  multer().none(),
  getPaymentChannels
);
router.get(
  "/payment-channel/:id",
  deserializeUser,
  requireUser,
  multer().none(),
  getPaymentChannel
);
router.post(
  "/payment-channel",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  multer().none(),
  store
);
router.put(
  "/payment-channel/:id",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  multer().none(),
  update
);

export default router;
