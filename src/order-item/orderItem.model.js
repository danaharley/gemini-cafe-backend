import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Product name must be three or more characters"],
      maxlength: [
        100,
        "Product name should be not exceed the max length than 100 characters",
      ],
      required: [true, "Product name must be filled"],
    },
    price: {
      type: Number,
      required: [true, "The price field must be filled"],
    },
    qty: {
      type: Number,
      required: [true, "The quantity field must be filled"],
      min: [1, "Minimum quantity is 1"],
    },
    products: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

export default mongoose.model("OrderItem", orderItemSchema);
