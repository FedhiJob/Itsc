import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";

export const healthService = {
  async getStatus() {
    await prisma.$queryRaw`SELECT 1`;

    return {
      service: "itsc-api",
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: "connected"
    };
  }
};
