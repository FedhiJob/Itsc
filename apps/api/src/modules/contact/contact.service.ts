import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { cleanData } from "../../utils/prisma-helpers.js";
import type { InquiryQueryInput, SubmitContactInput, UpdateInquiryInput } from "./contact.schema.js";

export const contactService = {
  async submit(input: SubmitContactInput) {
    return prisma.contactInquiry.create({ data: cleanData(input) });
  },

  async listInquiries(query: InquiryQueryInput) {
    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    const skip = (query.page - 1) * query.limit;

    const [inquiries, total] = await Promise.all([
      prisma.contactInquiry.findMany({
        where,
        orderBy: { submittedAt: "desc" },
        skip,
        take: query.limit
      }),
      prisma.contactInquiry.count({ where })
    ]);

    return {
      inquiries,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    };
  },

  async getInquiry(id: string) {
    const inquiry = await prisma.contactInquiry.findUnique({ where: { id } });

    if (!inquiry) {
      throw new AppError(404, "Inquiry not found.", "CONTACT_001");
    }

    return inquiry;
  },

  async updateInquiry(id: string, input: UpdateInquiryInput) {
    const inquiry = await prisma.contactInquiry.findUnique({ where: { id } });

    if (!inquiry) {
      throw new AppError(404, "Inquiry not found.", "CONTACT_001");
    }

    return prisma.contactInquiry.update({
      where: { id },
      data: cleanData(input)
    });
  }
};
