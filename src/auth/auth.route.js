import express from "express";
import multer from "multer";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";
import {
  registerHandler,
  loginhandler,
  logoutHandler,
  refreshAccessTokenHandler,
} from "./auth.controller.js";

const router = express.Router();

router.post("/register", multer().none(), registerHandler);
router.post("/login", multer().none(), loginhandler);
router.get("/refresh", refreshAccessTokenHandler);

// router.use(deserializeUser, requireUser);

router.delete("/logout", deserializeUser, requireUser, logoutHandler);

export default router;
