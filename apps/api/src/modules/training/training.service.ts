import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { cleanData } from "../../utils/prisma-helpers.js";
import type { CreateCategoryInput, CreateProgramInput, ProgramQueryInput, UpdateCategoryInput, UpdateProgramInput } from "./training.schema.js";

export const trainingService = {
  // --- Categories ---
  async listCategories() {
    return prisma.trainingCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          include: {
            _count: { select: { programs: { where: { deletedAt: null, status: "PUBLISHED" } } } }
          }
        },
        _count: { select: { programs: { where: { deletedAt: null, status: "PUBLISHED" } } } }
      }
    });
  },

  async getCategoryBySlug(slug: string) {
    const category = await prisma.trainingCategory.findUnique({
      where: { slug },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          include: {
            _count: { select: { programs: { where: { deletedAt: null, status: "PUBLISHED" } } } }
          }
        },
        programs: {
          where: { deletedAt: null, status: "PUBLISHED" },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
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

    if (input.parentId) {
      const parent = await prisma.trainingCategory.findUnique({ where: { id: input.parentId } });
      if (!parent) {
        throw new AppError(404, "Parent category not found.", "TRAINING_006");
      }
    }

    return prisma.trainingCategory.create({
      data: cleanData(input),
      include: {
        parent: { select: { id: true, name: true, slug: true } }
      }
    });
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

    if (input.parentId !== undefined && input.parentId !== null) {
      if (input.parentId === id) {
        throw new AppError(400, "A category cannot be its own parent.", "TRAINING_007");
      }
      const parent = await prisma.trainingCategory.findUnique({ where: { id: input.parentId } });
      if (!parent) {
        throw new AppError(404, "Parent category not found.", "TRAINING_006");
      }
    }

    return prisma.trainingCategory.update({
      where: { id },
      data: cleanData(input),
      include: {
        parent: { select: { id: true, name: true, slug: true } }
      }
    });
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
    const andConditions: Array<Record<string, unknown>> = [{ deletedAt: null }];

    if (query.category) {
      where.OR = [
        { category: { slug: query.category } },
        { category: { parent: { slug: query.category } } }
      ];
      andConditions.push({
        OR: [
          { category: { slug: query.category } },
          { category: { parent: { slug: query.category } } }
        ]
      });
    }

    if (query.status) {
      where.status = query.status;
      andConditions.push({ status: query.status });
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
      andConditions.push({ isFeatured: query.isFeatured });
    }

    const skip = (query.page - 1) * query.limit;
    if (query.search) {
      andConditions.push({
        OR: [
          { title: { contains: query.search, mode: "insensitive" } },
          { code: { contains: query.search, mode: "insensitive" } },
          { shortDescription: { contains: query.search, mode: "insensitive" } }
        ]
      });
    }

    const where = { AND: andConditions };

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [programs, total] = await Promise.all([
      prisma.trainingProgram.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              parentId: true,
              parent: { select: { id: true, name: true, slug: true } }
            }
          },
          author: { select: { id: true, fullName: true } }
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: query.limit
        take: limit
      }),
      prisma.trainingProgram.count({ where })
    ]);

    return {
      programs,
      pagination: {
        page: query.page,
        limit: query.limit,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / query.limit)
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getProgramBySlug(slug: string) {
    const program = await prisma.trainingProgram.findFirst({
      where: { slug, deletedAt: null },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
            parent: { select: { id: true, name: true, slug: true } }
          }
        },
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
      data: cleanData({ ...input, authorId }),
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
            parent: { select: { id: true, name: true, slug: true } }
          }
        },
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
      data: cleanData(input),
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
            parent: { select: { id: true, name: true, slug: true } }
          }
        },
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