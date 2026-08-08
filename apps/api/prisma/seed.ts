// Seed script — creates the initial SUPER_ADMIN account.
// Run with: npm run prisma:seed
//
// The default password is a MOCK value for development only. Change it after
// first login via the admin portal or by updating this script and re-running.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@itsc.com.et";
  // MOCK PASSWORD — replace with a strong password before production.
  const password = "ChangeMe123!";

  const existing = await prisma.administrator.findUnique({ where: { email } });

  if (existing) {
    console.log(`Admin already exists: ${email} (id: ${existing.id})`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.administrator.create({
    data: {
      fullName: "ITSC Administrator",
      email,
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });

  console.log(`Created admin: ${admin.email} (id: ${admin.id})`);
  console.log(`Default password: ${password} — CHANGE THIS AFTER FIRST LOGIN.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });