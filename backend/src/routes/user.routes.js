import express from "express";
import userControllers from "../controllers/user.controller.js";
import { userTypeMiddleware } from "../middlewares/commonMiddlewares.js";
import validateData from "../middlewares/validationMiddleware.js";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../validators/userSchema.js";

const userRoutes = express();

userRoutes.post(
  "/:userType/register",

  userTypeMiddleware,
  validateData(userRegisterSchema),
  userControllers.registerUser
);

userRoutes.post(
  "/login",
  validateData(userLoginSchema),
  userControllers.loginUser
);

userRoutes.patch("/verify-user/:token", userControllers.verifyUser);

export default userRoutes;
