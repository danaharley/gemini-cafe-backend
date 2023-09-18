export const requireUser = (req, res, next) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token or session has expired" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
