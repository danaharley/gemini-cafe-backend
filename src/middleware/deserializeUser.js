import { config } from "../config/index.js";
import userModel from "../user/user.model.js";
import errMessages from "../utils/errors.js";
import { verifyJwt } from "../utils/jwt.js";

export const deserializeUser = async (req, res, next) => {
  try {
    let access_token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new errMessages("You are not logged in", 401));
    }

    const decoded = verifyJwt(access_token, config.server.accessTokenKey);

    if (!decoded) {
      return next(new errMessages(`Invalid token or user doesn't exist`, 401));
    }

    const user = await userModel
      .findById({ _id: decoded.sub })
      .select("-password");

    if (!user) {
      return next(new errMessages(`User with that token no longer exist`, 401));
    }

    res.locals.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
