import fs from "fs";
import productModel from "./product.model.js";
import tagModel from "../tag/tag.model.js";
import categoryModel from "../category/category.model.js";
import { config } from "../config/index.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const { limit = 8, skip = 0, q = "", category = "", tags = [] } = req.query;

    let criteria = {};

    if (q.length) {
      criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };
    }

    if (category.length) {
      const findCategory = await categoryModel.findOne({
        name: { $regex: `${category}`, $options: "i" },
      });

      criteria = { ...criteria, category: findCategory._id };
    }

    if (tags.length) {
      const findTags = await tagModel.find({ name: { $in: tags } });

      criteria = { ...criteria, tags: { $in: findTags.map((tag) => tag._id) } };
    }

    const counts = await productModel.find(criteria).countDocuments();

    const products = await productModel
      .find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select()
      .select("_id name description price image createdAt updatedAt")
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "tags", select: "_id name" });

    if (!products) {
      return res.status(400).json({ message: "No Result Found" });
    }

    return res.status(200).json({ products, counts });
  } catch (error) {
    next(error);
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const product = await productModel
      .findOne({ _id: req.params.id })
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "tags", select: "_id name" });

    if (!product) return res.status(400).json({ message: "Data not found" });

    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    let payload = req.body;

    if (payload.category) {
      const category = await categoryModel.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      }
    }

    if (payload.tags && payload.tags.length) {
      const tags = await tagModel.find({ name: { $in: payload.tags } });

      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      try {
        const product = new productModel({
          ...payload,
          image: req.file.filename,
        });

        const saveProduct = await product.save();

        return res.status(201).json({
          message: "Data added successfully",
          data: saveProduct,
        });
      } catch (error) {
        fs.unlinkSync(req.file.path);

        if (error && error.name === "ValidationError") {
          return res.status(400).json({
            fields: error.errors,
          });
        }

        next(error);
      }
    }

    const product = new productModel(payload);

    const saveProduct = await product.save();

    return res.status(201).json({
      message: "Data added successfully",
      data: saveProduct,
    });
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.status(400).json({
        fields: error.errors,
      });
    }

    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let payload = req.body;

    const category = await categoryModel.findOne({
      name: { $regex: `${payload.category}`, $options: "i" },
    });

    if (category) {
      payload = { ...payload, category: category._id };
    }

    if (payload.tags && payload.tags.length) {
      const tags = await tagModel.find({ name: { $in: payload.tags } });

      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      try {
        const product = await productModel.findOne({ _id: req.params.id });

        if (!product) {
          fs.unlinkSync(req.file.path);

          return res.status(400).json({ message: "Data not found" });
        }

        const productUpdate = await productModel.findOneAndUpdate(
          { _id: product._id },
          { ...payload, image: req.file.filename },
          { new: true, runValidators: true }
        );

        const currentImage = `${config.img.path}/${product.image}`;

        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage);
        }

        return res.status(200).json({
          message: "Your data changes have been saved successfully",
          data: productUpdate,
        });
      } catch (error) {
        fs.unlinkSync(req.file.path);

        if (error && error.name === "ValidationError") {
          return res.status(400).json({
            fields: error.errors,
          });
        }

        next(error);
      }
    }

    const productUpdate = await productModel.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Your data changes have been saved successfully",
      data: productUpdate,
    });
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.status(400).json({
        fields: error.errors,
      });
    }

    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const product = await productModel.findOne({ _id: req.params.id });

    if (!product) return res.status(400).json({ message: "Data not found" });

    const deleteProduct = await productModel.findOneAndDelete({
      _id: product._id,
    });

    const currentImage = `${config.img.path}/${product.image}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    return res.status(200).json({
      message: "Data has been deleted successfully",
      data: deleteProduct,
    });
  } catch (error) {
    next(error);
  }
};
