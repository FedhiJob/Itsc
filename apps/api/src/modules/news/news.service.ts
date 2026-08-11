import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { cleanData } from "../../utils/prisma-helpers.js";
import type { CreateNewsInput, NewsQueryInput, UpdateNewsInput } from "./news.schema.js";

export const newsService = {
  async listArticles(query: NewsQueryInput) {
    const where: Record<string, unknown> = { deletedAt: null };

    if (query.status) {
      where.status = query.status;
    }

    const skip = (query.page - 1) * query.limit;

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        include: {
          author: { select: { id: true, fullName: true } }
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: query.limit
      }),
      prisma.newsArticle.count({ where })
    ]);

    return {
      articles,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    };
  },

  async getArticleBySlug(slug: string) {
    const article = await prisma.newsArticle.findFirst({
      where: { slug, deletedAt: null },
      include: {
        author: { select: { id: true, fullName: true } }
      }
    });

    if (!article) {
      throw new AppError(404, "Article not found.", "NEWS_001");
    }

    return article;
  },

  async getArticleById(id: string) {
    const article = await prisma.newsArticle.findFirst({
      where: { id, deletedAt: null },
      include: {
        author: { select: { id: true, fullName: true } }
      }
    });

    if (!article) {
      throw new AppError(404, "Article not found.", "NEWS_001");
    }

    return article;
  },

  async createArticle(input: CreateNewsInput, authorId: string) {
    const slugExists = await prisma.newsArticle.findUnique({ where: { slug: input.slug } });

    if (slugExists) {
      throw new AppError(409, "An article with this slug already exists.", "NEWS_002");
    }

    const data = {
      ...input,
      authorId,
      publishedAt: input.status === "PUBLISHED" ? (input.publishedAt ? new Date(input.publishedAt) : new Date()) : null
    };

    return prisma.newsArticle.create({
      data: cleanData(data),
      include: {
        author: { select: { id: true, fullName: true } }
      }
    });
  },

  async updateArticle(id: string, input: UpdateNewsInput) {
    const article = await prisma.newsArticle.findFirst({
      where: { id, deletedAt: null }
    });

    if (!article) {
      throw new AppError(404, "Article not found.", "NEWS_001");
    }

    if (input.slug && input.slug !== article.slug) {
      const slugExists = await prisma.newsArticle.findUnique({ where: { slug: input.slug } });
      if (slugExists) {
        throw new AppError(409, "An article with this slug already exists.", "NEWS_002");
      }
    }

    const data: Record<string, unknown> = { ...input };

    if (input.status === "PUBLISHED" && !article.publishedAt) {
      data.publishedAt = new Date();
    } else if (input.status && input.status !== "PUBLISHED") {
      data.publishedAt = null;
    } else {
      delete data.publishedAt;
    }

    return prisma.newsArticle.update({
      where: { id },
      data: cleanData(data),
      include: {
        author: { select: { id: true, fullName: true } }
      }
    });
  },

  async softDeleteArticle(id: string) {
    const article = await prisma.newsArticle.findFirst({
      where: { id, deletedAt: null }
    });

    if (!article) {
      throw new AppError(404, "Article not found.", "NEWS_001");
    }

    return prisma.newsArticle.update({
      where: { id },
      data: { deletedAt: new Date(), status: "ARCHIVED" }
    });
  }
};