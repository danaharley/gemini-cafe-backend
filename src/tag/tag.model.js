import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Tag name must be three or more characters"],
      maxlength: [
        50,
        "Tag name should be not exceed the max length than 50 characters",
      ],
      required: [true, "Tag name must be filled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tag", TagSchema);
