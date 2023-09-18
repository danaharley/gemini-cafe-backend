import express from "express";
import multer from "multer";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";

import { getOrder, store } from "./order.controller.js";

const router = express.Router();

// router.use(deserializeUser, requireUser);

router.get("/orders", deserializeUser, requireUser, multer().none(), getOrder);
router.post("/orders", deserializeUser, requireUser, multer().none(), store);

export default router;
