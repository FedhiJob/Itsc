import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import type { CreateAdminInput, LoginInput } from "./auth.schema.js";

type JwtPayload = {
  sub: string;
  role: string;
};

export const authService = {
  async login(input: LoginInput) {
    const admin = await prisma.administrator.findUnique({
      where: { email: input.email }
    });

    if (!admin || !admin.status) {
      throw new AppError(401, "Invalid email or password.", "AUTH_001");
    }

    const isValidPassword = await bcrypt.compare(input.password, admin.passwordHash);

    if (!isValidPassword) {
      throw new AppError(401, "Invalid email or password.", "AUTH_001");
    }

    const token = this.signToken({ sub: admin.id, role: admin.role });

    await prisma.administrator.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    return {
      accessToken: token,
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role
      }
    };
  },

  async createAdmin(input: CreateAdminInput) {
    const existing = await prisma.administrator.findUnique({
      where: { email: input.email }
    });

    if (existing) {
      throw new AppError(409, "An administrator with this email already exists.", "AUTH_002");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const admin = await prisma.administrator.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        passwordHash,
        role: input.role
      }
    });

    return {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role
    };
  },

  async getMe(adminId: string) {
    const admin = await prisma.administrator.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true
      }
    });

    if (!admin) {
      throw new AppError(404, "Administrator not found.", "AUTH_003");
    }

    return admin;
  },

  signToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: "itsc-api"
    });
  },

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET, { issuer: "itsc-api" }) as JwtPayload;
    } catch {
      throw new AppError(401, "Invalid or expired token.", "AUTH_004");
    }
  }
};

