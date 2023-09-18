import deliveryModel from "./delivery.model.js";

export const getDeliveryAddress = async (req, res, next) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const deliveryAddress = await deliveryModel
      .find({ user: res.locals.user._id })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort("-createdAt");

    const count = await deliveryModel
      .find({
        user: res.locals.user._id,
      })
      .countDocuments();

    return res.status(200).json({
      data: deliveryAddress,
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = res.locals.user;

    let address = new deliveryModel({ ...payload, user: user._id });

    await address.save();

    return res.status(201).json(address);
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
    const { id } = req.params;
    const { _id, ...payload } = req.body;

    const address = await deliveryModel.findOne({ _id: id });

    if (!address) return res.status(400).json({ message: "Data not found" });

    const newAddress = await deliveryModel.findOneAndUpdate(
      { _id: address._id },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(newAddress);
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
    const { id } = req.params;

    const address = await deliveryModel.findOne({ _id: id });

    if (!address) return res.status(400).json({ message: "Data not found" });

    const deleteAddress = await deliveryModel.findOneAndDelete({
      _id: address._id,
    });

    return res.status(200).json(deleteAddress);
  } catch (error) {
    next(error);
  }
};
