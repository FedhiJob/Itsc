// Seed script — creates the initial SUPER_ADMIN account.
// Run with: npm run prisma:seed
//
// The default password is a MOCK value for development only. Change it after
// first login via the admin portal or by updating this script and re-running.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Explicitly load the API's .env file so the Prisma datasource can read
// DATABASE_URL even when this script is invoked outside the app bootstrap.
loadEnv({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
  override: true
});

const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL || (isProduction ? "" : "admin@itsc.com.et");
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || (isProduction ? "" : "ChangeMe123!");
  const fullName = process.env.BOOTSTRAP_ADMIN_NAME || "ITSC System Administrator";

  if (isProduction && (!email || !password || password.length < 12)) {
    throw new Error(
      "In production, BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD (minimum 12 characters) must be supplied via environment variables."
    );
  }

  const existing = await prisma.administrator.findUnique({ where: { email } });

  if (existing) {
    console.log(`[Bootstrap] Admin already exists: ${email} (id: ${existing.id}, role: ${existing.role})`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.administrator.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });

  console.log(`[Bootstrap] Super Administrator created successfully: ${admin.email} (id: ${admin.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });