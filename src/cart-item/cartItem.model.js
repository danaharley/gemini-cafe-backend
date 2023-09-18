import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
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
    qty: {
      type: Number,
      required: [true, "The quantity field must be filled"],
      min: [1, "Minimum quantity is 1"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CartItem", cartItemSchema);
