import mongoose from "mongoose";

const PaymentChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be filled"],
    },
    payment: {
      type: String,
      lowercase: true,
      required: [true, "Payment name must be filled"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      enum: ["minute", "hour", "day"],
      default: "day",
    },
    image_url: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentChannel", PaymentChannelSchema);
