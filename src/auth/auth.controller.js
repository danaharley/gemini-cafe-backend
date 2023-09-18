import pkg from "lodash";
import bcrypt from "bcryptjs";
import userModel from "../user/user.model.js";
import errMessages from "../utils/errors.js";
import { signJwt, verifyJwt } from "../utils/jwt.js";
import { config } from "../config/index.js";

const { omit } = pkg;

export const registerHandler = async (req, res, next) => {
  try {
    const payload = req.body;

    const user = new userModel(payload);

    await user.save();

    const excludedFields = omit(user.toJSON(), ["password"]);

    return res.status(201).json({
      message: "Registration Success",
      user: excludedFields,
    });
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.status(400).json({
        fields: error.errors,
      });
    }

    next(error);
  }
};

export const loginhandler = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return next(new errMessages("Invalid credentials", 401));
    }

    const access_token = signJwt(
      { sub: user._id },
      config.server.accessTokenKey,
      { expiresIn: `${config.server.accessTokenExp}m` }
    );

    const refresh_token = signJwt(
      { sub: user._id },
      config.server.refreshTokenKey,
      { expiresIn: `${config.server.refreshTokenExp}m` }
    );

    res.cookie("access_token", access_token, {
      expires: new Date(Date.now() + config.server.accessTokenExp * 60 * 1000),
      maxAge: config.server.accessTokenExp * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookie("refresh_token", refresh_token, {
      expires: new Date(Date.now() + config.server.refreshTokenExp * 60 * 1000),
      maxAge: config.server.refreshTokenExp * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookie("logged_in", true, {
      expires: new Date(Date.now() + config.server.accessTokenExp * 60 * 1000),
      maxAge: config.server.accessTokenExp * 60 * 1000,
      httpOnly: false,
      sameSite: "lax",
    });

    return res
      .status(200)
      .json({ message: "Logged in successfuly", access_token });
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.status(400).json({
        fields: error.errors,
      });
    }

    next(error);
  }
};

export const logoutHandler = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("logged_in");

    return res
      .status(200)
      .json({ message: "You have been successfully logged out" });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessTokenHandler = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    const message = "Could not refresh access token";

    const decoded = verifyJwt(refresh_token, config.server.refreshTokenKey);

    if (!decoded) {
      return next(new errMessages(message, 401));
    }

    const user = await userModel.findOne({ _id: decoded.sub });

    if (!user) {
      return next(new AppError(message, 403));
    }

    const access_token = signJwt(
      { sub: user._id },
      config.server.accessTokenKey,
      { expiresIn: `${config.server.accessTokenExp}m` }
    );

    res.cookie("access_token", access_token, {
      expires: new Date(Date.now() + config.server.accessTokenExp * 60 * 1000),
      maxAge: config.server.accessTokenExp * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookie("logged_in", true, {
      expires: new Date(Date.now() + config.server.accessTokenExp * 60 * 1000),
      maxAge: config.server.accessTokenExp * 60 * 1000,
      httpOnly: false,
      sameSite: "lax",
    });

    return res.status(200).json({ status: "success", access_token });
  } catch (error) {
    next();
  }
};
