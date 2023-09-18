import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { config } from "./config/index.js";
import url from "url";
import path from "path";

import productsRouter from "./product/product.route.js";
import authRouter from "./auth/auth.route.js";
import tagsRouter from "./tag/tag.route.js";
import categoryRouter from "./category/category.route.js";
import usersRouter from "./user/user.route.js";
import wilayahRouter from "./wilayah/wilayah.route.js";
import deliveryAddressRouter from "./delivery-address/delivery.route.js";
import cartRouter from "./cart/cart.route.js";
import orderRouter from "./order/order.route.js";
import invoiceRouter from "./invoice/invoice.route.js";
import paymentChannelRouter from "./payment-channel/payChannel.route.js";

const app = express();
const dirname = url.fileURLToPath(new URL(".", import.meta.url));

mongoose
  .connect(config.mongodb.url)
  .then(() => {
    console.log("Database connected");
    Server();
  })
  .catch((error) => console.log(error));

const Server = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(dirname, "../public")));

  app.use(
    "*/assets/products/images",
    express.static("public/assets/products/images")
  );

  app.use(
    cors({
      credentials: true,
      origin: config.server.origin,
    })
  );

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api", tagsRouter);
  app.use("/api", categoryRouter);
  app.use("/api", productsRouter);
  app.use("/api/wilayah", wilayahRouter);
  app.use("/api", deliveryAddressRouter);
  app.use("/api", cartRouter);
  app.use("/api", orderRouter);
  app.use("/api", invoiceRouter);
  app.use("/api", paymentChannelRouter);

  app.get("/testing", (req, res, next) => {
    return res.status(200).json({ msg: "Hai, nubicoder" });
  });

  app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found.`);
    err.statusCode = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });

  app.listen(config.server.port, () =>
    console.log(`Server started. Running on port ${config.server.port}`)
  );
};
