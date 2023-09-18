import express from "express";
import { deserializeUser } from "../middleware/deserializeUser.js";
import { requireUser } from "../middleware/requireUser.js";

import {
  getProvinsi,
  getKabupaten,
  getKecamatan,
  getKelurahan,
} from "./wilayah.controller.js";

const router = express.Router();

// router.use(deserializeUser, requireUser);

router.get("/provinsi", deserializeUser, requireUser, getProvinsi);
router.get("/kabupaten", deserializeUser, requireUser, getKabupaten);
router.get("/kecamatan", deserializeUser, requireUser, getKecamatan);
router.get("/kelurahan", deserializeUser, requireUser, getKelurahan);

export default router;
