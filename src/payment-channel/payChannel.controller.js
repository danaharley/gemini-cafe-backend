import payChannelModel from "./payChannel.model.js";

export const getPaymentChannels = async (req, res, next) => {
  try {
    const channels = await payChannelModel.find();

    return res.status(200).json({ data: channels });
  } catch (error) {
    next(error);
  }
};

export const getPaymentChannel = async (req, res, next) => {
  try {
    const channels = await payChannelModel.findOne({ _id: req.params.id });

    if (!channels) return res.status(400).json({ message: "Data not found" });

    return res.status(200).json({ data: channels });
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    let payload = req.body;

    const channels = new payChannelModel(payload);

    await channels.save();

    return res.status(201).json({
      message: "Data added successfully",
      data: channels,
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
  const payload = req.body;
  try {
    const payment = await payChannelModel.findOne({ _id: req.params.id });

    if (!payment) return res.status(400).json({ message: "Data not found" });

    const updateIsActive = await payChannelModel.findOneAndUpdate(
      { _id: payment._id },
      payload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Your data changes has been saved successfully",
      data: updateIsActive,
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
