import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
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
    description: {
      type: String,
      maxlength: [
        1000,
        "Description should be not exceed the max length than 1000 characters",
      ],
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      // default: "food-not-found.jpg",
      // default:
      //   "https://res.cloudinary.com/nubicoder/image/upload/v1661571566/danaharley/food_not_found_jo080x.jpg",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
