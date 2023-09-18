import mongoose from "mongoose";

const deliveryAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Address name must be three or more characters"],
      maxlength: [
        255,
        "Address name should be not exceed the max length than 255 characters",
      ],
      required: [true, "Address name must be filled"],
    },
    villages: {
      type: String,
      maxlength: [
        200,
        "Village name should be not exceed the max length than 200 characters",
      ],
      required: [true, "Village name must be filled"],
    },
    districts: {
      type: String,
      maxlength: [
        200,
        "District name should be not exceed the max length than 200 characters",
      ],
      required: [true, "District name must be filled"],
    },
    regencies: {
      type: String,
      maxlength: [
        200,
        "Regency name should be not exceed the max length than 200 characters",
      ],
      required: [true, "Regency name must be filled"],
    },
    provinces: {
      type: String,
      maxlength: [
        200,
        "Province name should be not exceed the max length than 200 characters",
      ],
      required: [true, "Province name must be filled"],
    },
    details: {
      type: String,
      maxlength: [
        1000,
        "Details should be not exceed the max length than 1000 characters",
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryAddress", deliveryAddressSchema);
