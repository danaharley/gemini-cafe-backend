import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    sub_total: {
      type: Number,
      required: [true, "The Subtotal field must be filled"],
    },
    delivery_fee: {
      type: Number,
      required: [true, "The delivery fee filed must be filled"],
    },
    delivery_address: {
      province: {
        type: String,
        required: [true, "The province field must be filled"],
      },
      regency: {
        type: String,
        required: [true, "The regency field must be filled"],
      },
      district: {
        type: String,
        required: [true, "The district field must be filled"],
      },
      village: {
        type: String,
        required: [true, "The village field must be filled"],
      },
      details: String,
    },
    total: {
      type: Number,
      required: [true, "The total field must be filled"],
    },
    payment_status: {
      type: String,
      enum: ["waiting_payment", "paid"],
      default: "waiting_payment",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
