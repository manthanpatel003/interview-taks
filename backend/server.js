import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { PORT } from "./src/config.js";
import indexRouter from "./src/routes/index.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://interview-taks-a1bs.vercel.app"],
    credentials: true,
  })
);

// Routes
app.use("/api", indexRouter);

app.get("/", (req, res) => {
  res.send("Hello World, 👋🏻 from Auth API!");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on Port : ${PORT}`);
});
