import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Category name must be three or more characters"],
      maxlength: [
        50,
        "Category name should be not exceed the max length than 50 characters",
      ],
      required: [true, "Category name must be filled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
