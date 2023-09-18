import tagModel from "./tag.model.js";

export const getAlltags = async (req, res, next) => {
  try {
    const tags = await tagModel.find();

    return res.status(200).json({ data: tags });
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const payload = req.body;

    const tag = new tagModel(payload);

    await tag.save();

    return res.status(201).json({
      message: "Data added successfully",
      data: tag,
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

    const tag = await tagModel.findOne({ _id: req.params.id });

    if (!tag) return res.status(400).json({ message: "Data not found" });

    const updateTag = await tagModel.findOneAndUpdate(
      { _id: tag._id },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Your data changes has been saved successfully",
      data: updateTag,
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
    const tag = await tagModel.findOne({ _id: req.params.id });

    if (!tag) return res.status(400).json({ message: "Data not found" });

    const deleteTag = await tagModel.findOneAndDelete({ _id: tag._id });

    return res.status(200).json({
      message: "Data has been deleted successfully",
      data: deleteTag,
    });
  } catch (error) {
    next(error);
  }
};
