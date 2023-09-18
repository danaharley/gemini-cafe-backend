import express from "express";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";
import { restrictTo } from "../middleware/restrictTo.js";

import { getAllUsersHandler, getMehandler } from "./user.controller.js";

const router = express.Router();

// router.use(deserializeUser, requireUser);

router.get("/me", deserializeUser, requireUser, getMehandler);
router.get(
  "/",
  deserializeUser,
  requireUser,
  restrictTo("admin"),
  getAllUsersHandler
);

export default router;
