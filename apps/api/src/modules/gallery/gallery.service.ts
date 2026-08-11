import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { cleanData } from "../../utils/prisma-helpers.js";
import type { AddImageInput, CreateAlbumInput, UpdateAlbumInput, UpdateImageInput } from "./gallery.schema.js";

export const galleryService = {
  // --- Albums ---
  async listAlbums(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [albums, total] = await Promise.all([
      prisma.galleryAlbum.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { images: true } },
          images: { take: 1, orderBy: { uploadedAt: "desc" }, select: { imageUrl: true, altText: true } }
        },
        skip,
        take: limit
      }),
      prisma.galleryAlbum.count()
    ]);

    return {
      albums,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  },

  async getAlbumBySlug(slug: string) {
    const album = await prisma.galleryAlbum.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { uploadedAt: "asc" } }
      }
    });

    if (!album) {
      throw new AppError(404, "Album not found.", "GALLERY_001");
    }

    return album;
  },

  async createAlbum(input: CreateAlbumInput) {
    const existing = await prisma.galleryAlbum.findUnique({ where: { slug: input.slug } });

    if (existing) {
      throw new AppError(409, "An album with this slug already exists.", "GALLERY_002");
    }

    return prisma.galleryAlbum.create({ data: cleanData(input) });
  },

  async updateAlbum(id: string, input: UpdateAlbumInput) {
    const album = await prisma.galleryAlbum.findUnique({ where: { id } });

    if (!album) {
      throw new AppError(404, "Album not found.", "GALLERY_001");
    }

    if (input.slug && input.slug !== album.slug) {
      const slugExists = await prisma.galleryAlbum.findUnique({ where: { slug: input.slug } });
      if (slugExists) {
        throw new AppError(409, "An album with this slug already exists.", "GALLERY_002");
      }
    }

    return prisma.galleryAlbum.update({ where: { id }, data: cleanData(input) });
  },

  async deleteAlbum(id: string) {
    const album = await prisma.galleryAlbum.findUnique({ where: { id } });

    if (!album) {
      throw new AppError(404, "Album not found.", "GALLERY_001");
    }

    await prisma.galleryAlbum.delete({ where: { id } });
  },

  // --- Images ---
  async addImage(albumId: string, input: AddImageInput) {
    const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });

    if (!album) {
      throw new AppError(404, "Album not found.", "GALLERY_001");
    }

    return prisma.galleryImage.create({
      data: cleanData({ ...input, albumId }),
      include: { album: { select: { id: true, title: true, slug: true } } }
    });
  },

  async updateImage(id: string, input: UpdateImageInput) {
    const image = await prisma.galleryImage.findUnique({ where: { id } });

    if (!image) {
      throw new AppError(404, "Image not found.", "GALLERY_003");
    }

    return prisma.galleryImage.update({
      where: { id },
      data: cleanData(input),
      include: { album: { select: { id: true, title: true, slug: true } } }
    });
  },

  async deleteImage(id: string) {
    const image = await prisma.galleryImage.findUnique({ where: { id } });

    if (!image) {
      throw new AppError(404, "Image not found.", "GALLERY_003");
    }

    await prisma.galleryImage.delete({ where: { id } });
  }
};