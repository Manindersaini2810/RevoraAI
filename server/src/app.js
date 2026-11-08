import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Revora AI Recovery API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount Main API Router
app.use("/api", apiRouter);

// Centralized Error Handling
app.use(errorHandler);

export default app;
