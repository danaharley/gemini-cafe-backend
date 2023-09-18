import express from "express";
import multer from "multer";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";

import { getCart, update } from "./cart.controller.js";

const router = express.Router();

// router.use(deserializeUser, requireUser);

router.get("/carts", deserializeUser, requireUser, multer().none(), getCart);
router.put("/carts", deserializeUser, requireUser, multer().none(), update);

export default router;
