import csv from "csvtojson";
import { fileURLToPath } from "url";
import path from "path";

export const getProvinsi = async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const db_provinsi = path.resolve(__dirname, "./data/provinces.csv");

  try {
    const data = await csv().fromFile(db_provinsi);

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getKabupaten = async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const db_kabupaten = path.resolve(__dirname, "./data/regencies.csv");

  try {
    const { kode_induk } = req.query;
    const data = await csv().fromFile(db_kabupaten);

    if (!kode_induk) return res.status(200).json(data);

    const results = data.filter(
      (result) => result.kode_provinsi === kode_induk
    );

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export const getKecamatan = async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const db_kecamatan = path.resolve(__dirname, "./data/districts.csv");

  try {
    const { kode_induk } = req.query;
    const data = await csv().fromFile(db_kecamatan);

    if (!kode_induk) return res.status(200).json(data);

    const results = data.filter(
      (result) => result.kode_kabupaten === kode_induk
    );

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export const getKelurahan = async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const db_desa = path.resolve(__dirname, "./data/villages.csv");

  try {
    const { kode_induk } = req.query;
    const data = await csv().fromFile(db_desa);

    if (!kode_induk) return res.status(200).json(data);

    const results = data.filter(
      (result) => result.kode_kecamatan === kode_induk
    );

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};
