import midtransClient from "midtrans-client";
import { config } from "../config/index.js";
import invoiceModel from "./invoice.model.js";
import orderModel from "../order/order.model.js";
import payChannelModel from "../payment-channel/payChannel.model.js";

const snap = new midtransClient.Snap({
  isProduction: config.midtrans.isProduction,
  serverKey: config.midtrans.serverKey,
  clientKey: config.midtrans.clientKey,
});

export const show = async (req, res, next) => {
  try {
    const { order_id } = req.params;

    const invoice = await invoiceModel
      .findOne({ order: order_id })
      .populate({
        path: "order",
        populate: {
          path: "order_items",
        },
      })
      .populate({ path: "user", select: "-password" });
    // .findOne({ order: order_id })
    // .populate("order")
    // .populate("order.order_items")
    // .populate("user");

    if (!invoice) {
      return res
        .status(500)
        .json({ message: "You have not placed any orders" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    return res.status(400).json({
      message: "Error when getting invoice",
    });
  }
};

export const initiatePayment = async (req, res) => {
  try {
    const { order_id } = req.params;

    const invoice = await invoiceModel
      .findOne({ order: order_id })
      .populate("order")
      .populate({ path: "user", select: "-password" });

    if (!invoice) {
      return res
        .status(500)
        .json({ message: "You have not placed any orders" });
    }

    const channels = await payChannelModel.find();

    const payment_lists = channels
      .filter((list) => list.isActive === true)
      .map((item) => item.payment);

    const params = {
      transaction_details: {
        order_id: invoice.order._id,
        gross_amount: invoice.total,
      },
      enabled_payments: payment_lists,
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: invoice.user.fullname,
        email: invoice.user.email,
      },
    };

    const response = await snap.createTransaction(params);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      error: error.message,
      code: error.httpStatusCode,
      apiRes: error.ApiResponse,
    });
  }
};

export const handleMidtransNotification = async (req, res, next) => {
  try {
    const statusRes = await snap.transaction.notification(req.body);
    const orderId = statusRes.order_id;
    const transactionStatus = statusRes.transaction_status;
    const fraudStatus = statusRes.fraud_status;

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        await snap.transaction.approve(orderId);

        await invoiceModel.findOneAndUpdate(
          { order: orderId },
          { payment_status: "paid" }
        );

        await orderModel.findOneAndUpdate(
          { _id: orderId },
          { status: "processing" }
        );

        return res.status(200).json("success");
      } else if (fraudStatus == "accept") {
        await invoiceModel.findOneAndUpdate(
          { order: orderId },
          { payment_status: "paid" }
        );

        await orderModel.findOneAndUpdate(
          { _id: orderId },
          { status: "processing" }
        );

        return res.status(200).json("success");
      } else {
        return res.json("ok");
      }
    } else if (transactionStatus == "settlement") {
      await invoiceModel.findOneAndUpdate(
        { order: orderId },
        { payment_status: "paid" },
        { new: true }
      );

      await orderModel.findOneAndUpdate(
        { _id: orderId },
        { status: "delivered" }
      );

      return res.status(200).json("success");
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json("Something went wrong");
  }
};
