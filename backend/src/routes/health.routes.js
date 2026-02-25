import { Router } from "express";
import { prisma } from "../db/prisma.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ api: "ok" });
});

router.get("/health/db", async (req, res, next) => {
  try {
    // Forzamos conexión real a Azure SQL
    await prisma.$connect();

    const result = await prisma.$queryRaw`SELECT 1 AS ok`;

    res.json({
      db: "connected",
      result
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
});

export default router;