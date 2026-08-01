import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import type { CreateCategoryInput, CreateProgramInput, ProgramQueryInput, UpdateCategoryInput, UpdateProgramInput } from "./training.schema.js";

export const trainingService = {
  // --- Categories ---
  async listCategories() {
    return prisma.trainingCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { programs: { where: { deletedAt: null, status: "PUBLISHED" } } } }
      }
    });
  },

  async getCategoryBySlug(slug: string) {
    const category = await prisma.trainingCategory.findUnique({
      where: { slug },
      include: {
        programs: {
          where: { deletedAt: null, status: "PUBLISHED" },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!category) {
      throw new AppError(404, "Category not found.", "TRAINING_001");
    }

    return category;
  },

  async createCategory(input: CreateCategoryInput) {
    const existing = await prisma.trainingCategory.findUnique({ where: { slug: input.slug } });

    if (existing) {
      throw new AppError(409, "A category with this slug already exists.", "TRAINING_002");
    }

    return prisma.trainingCategory.create({ data: input });
  },

  async updateCategory(id: string, input: UpdateCategoryInput) {
    const category = await prisma.trainingCategory.findUnique({ where: { id } });

    if (!category) {
      throw new AppError(404, "Category not found.", "TRAINING_001");
    }

    if (input.slug && input.slug !== category.slug) {
      const slugExists = await prisma.trainingCategory.findUnique({ where: { slug: input.slug } });
      if (slugExists) {
        throw new AppError(409, "A category with this slug already exists.", "TRAINING_002");
      }
    }

    return prisma.trainingCategory.update({ where: { id }, data: input });
  },

  async deleteCategory(id: string) {
    const category = await prisma.trainingCategory.findUnique({ where: { id } });

    if (!category) {
      throw new AppError(404, "Category not found.", "TRAINING_001");
    }

    const programCount = await prisma.trainingProgram.count({ where: { categoryId: id, deletedAt: null } });

    if (programCount > 0) {
      throw new AppError(409, "Cannot delete category with active programs. Archive or reassign them first.", "TRAINING_003");
    }

    await prisma.trainingCategory.delete({ where: { id } });
  },

  // --- Programs ---
  async listPrograms(query: ProgramQueryInput) {
    const where: Record<string, unknown> = { deletedAt: null };

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.featured !== undefined) {
      where.isFeatured = query.featured;
    }

    const skip = (query.page - 1) * query.limit;

    const [programs, total] = await Promise.all([
      prisma.trainingProgram.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, fullName: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: query.limit
      }),
      prisma.trainingProgram.count({ where })
    ]);

    return {
      programs,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    };
  },

  async getProgramBySlug(slug: string) {
    const program = await prisma.trainingProgram.findFirst({
      where: { slug, deletedAt: null },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, fullName: true } }
      }
    });

    if (!program) {
      throw new AppError(404, "Program not found.", "TRAINING_004");
    }

    return program;
  },

  async createProgram(input: CreateProgramInput, authorId: string) {
    const category = await prisma.trainingCategory.findUnique({ where: { id: input.categoryId } });

    if (!category) {
      throw new AppError(404, "Category not found.", "TRAINING_001");
    }

    const slugExists = await prisma.trainingProgram.findUnique({ where: { slug: input.slug } });

    if (slugExists) {
      throw new AppError(409, "A program with this slug already exists.", "TRAINING_005");
    }

    return prisma.trainingProgram.create({
      data: { ...input, authorId },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, fullName: true } }
      }
    });
  },

  async updateProgram(id: string, input: UpdateProgramInput) {
    const program = await prisma.trainingProgram.findFirst({
      where: { id, deletedAt: null }
    });

    if (!program) {
      throw new AppError(404, "Program not found.", "TRAINING_004");
    }

    if (input.slug && input.slug !== program.slug) {
      const slugExists = await prisma.trainingProgram.findUnique({ where: { slug: input.slug } });
      if (slugExists) {
        throw new AppError(409, "A program with this slug already exists.", "TRAINING_005");
      }
    }

    if (input.categoryId) {
      const category = await prisma.trainingCategory.findUnique({ where: { id: input.categoryId } });
      if (!category) {
        throw new AppError(404, "Category not found.", "TRAINING_001");
      }
    }

    return prisma.trainingProgram.update({
      where: { id },
      data: input,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, fullName: true } }
      }
    });
  },

  async softDeleteProgram(id: string) {
    const program = await prisma.trainingProgram.findFirst({
      where: { id, deletedAt: null }
    });

    if (!program) {
      throw new AppError(404, "Program not found.", "TRAINING_004");
    }

    return prisma.trainingProgram.update({
      where: { id },
      data: { deletedAt: new Date(), status: "ARCHIVED" }
    });
  }
};
