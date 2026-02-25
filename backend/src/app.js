import express from "express";
import cors from "cors";

import roomsRoutes from "./routes/rooms.routes.js";
import healthRoutes from "./routes/health.routes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/", healthRoutes);
  app.use("/api/rooms", roomsRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  });

  return app;
}