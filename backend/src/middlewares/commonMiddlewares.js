import { StatusCodes } from "http-status-codes";

export const userTypeMiddleware = (req, res, next) => {
  const { userType } = req.params;

  if (!userType || !["admin", "customer"].includes(userType)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid user type" });
  }

  next();
};
