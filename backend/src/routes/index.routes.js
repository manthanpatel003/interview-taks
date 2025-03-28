import express from "express";
import userRoutes from "./user.routes.js";

const indexRouter = express();

indexRouter.use("/user", userRoutes);

export default indexRouter;
