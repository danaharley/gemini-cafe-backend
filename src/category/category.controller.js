import categoryModel from "./category.model.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();

    return res.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const payload = req.body;

    const category = new categoryModel(payload);

    await category.save();

    return res.status(201).json({
      message: "Data added successfully",
      data: category,
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
    const payload = req.body;

    const category = await categoryModel.findOne({ _id: req.params.id });

    if (!category) return res.status(400).json({ message: "Data not found" });

    const updateCategory = await categoryModel.findOneAndUpdate(
      { _id: category._id },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Your data changes has been saved successfully",
      data: updateCategory,
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
    const category = await categoryModel.findOne({ _id: req.params.id });

    if (!category) return res.status(400).json({ message: "Data not found" });

    const deleteCategory = await categoryModel.findOneAndDelete({
      _id: category._id,
    });

    return res.status(200).json({
      message: "Data has been deleted successfully",
      data: deleteCategory,
    });
  } catch (error) {
    next(error);
  }
};
