import express from "express";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

import {
  show,
  initiatePayment,
  handleMidtransNotification,
} from "./invoice.controller.js";

// router.use(deserializeUser, requireUser);

router.get("/invoices/:order_id", deserializeUser, requireUser, show);

router.get(
  "/invoices/:order_id/initiate-payment",
  deserializeUser,
  requireUser,
  initiatePayment
);
router.post("/invoices/handle-midtrans", handleMidtransNotification);

export default router;
