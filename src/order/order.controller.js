import mongoose from "mongoose";
import orderModel from "./order.model.js";
import orderItemModel from "../order-item/orderItem.model.js";
import cartItemModel from "../cart-item/cartItem.model.js";
import deliveryAddressModel from "../delivery-address/delivery.model.js";

export const getOrder = async (req, res, next) => {
  try {
    const { limit = 0, skip = 0 } = req.query;

    const orders = await orderModel
      .find({ user: res.locals.user._id })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate({
        path: "order_items",
        populate: {
          path: "products",
        },
      })
      .sort("-createdAt");

    const count = await orderModel
      .find({ user: res.locals.user._id })
      .countDocuments();

    return res.status(200).json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const { delivery_fee, delivery_address } = req.body;

    if (!delivery_address) {
      return res.status(500).json({ message: "Shipping address is not set" });
    }

    const items = await cartItemModel
      .find({ user: res.locals.user._id })
      .populate("products");

    if (!items.length) {
      return res.status(400).json({
        message: "Can not create order because you have no items in cart",
      });
    }

    const address = await deliveryAddressModel.findOne({
      _id: delivery_address,
    });

    if (!address) {
      return res.status(500).json({ message: "Shipping address is not set" });
    }

    const order = new orderModel({
      _id: new mongoose.Types.ObjectId(),
      status: "waiting_payment",
      delivery_fee: delivery_fee,
      delivery_address: {
        province: address.provinces,
        regency: address.regencies,
        district: address.districts,
        village: address.villages,
        details: address.details,
      },
      user: res.locals.user._id,
    });

    const orderItems = await orderItemModel.insertMany(
      items.map((item) => ({
        ...item,
        name: item.products.name,
        qty: parseInt(item.qty),
        price: parseInt(item.products.price),
        order: order._id,
        products: item.products._id,
      }))
    );

    orderItems.forEach((item) => order.order_items.push(item));

    order.save();

    await cartItemModel.deleteMany({ user: res.locals.user._id });

    return res.status(200).json(order);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.status(400).json({
        error: error.errors,
      });
    }

    next(error);
  }
};
