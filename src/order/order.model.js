import mongoose from "mongoose";
import MongooseSequence from "mongoose-sequence";
import Invoice from "../invoice/invoice.model.js";

const AutoIncrement = MongooseSequence(mongoose);

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enaum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, { inc_field: "orderNumber" });

orderSchema.virtual("items_count").get(function () {
  return this.order_items.reduce((total, item) => {
    return total + parseInt(item.qty);
  }, 0);
});

orderSchema.post("save", async function () {
  const subTotal = this.order_items.reduce(
    (sum, item) => (sum += item.price * item.qty),
    0
  );

  const invoice = new Invoice({
    user: this.user,
    order: this._id,
    sub_total: subTotal,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(subTotal + this.delivery_fee),
    delivery_address: this.delivery_address,
  });

  await invoice.save();
});

export default mongoose.model("Order", orderSchema);
