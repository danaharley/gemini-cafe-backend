import userModel from "./user.model.js";

export const getMehandler = async (req, res, next) => {
  try {
    const user = res.locals.user;

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersHandler = async (req, res, next) => {
  try {
    const users = await userModel.find();

    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
