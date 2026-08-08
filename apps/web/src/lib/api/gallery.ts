// Server-side data access for Gallery — fetches albums + images from the API,
// maps to shared contracts, and falls back to mock data when unavailable.
import type { GalleryAlbum, GalleryContent, GalleryImage } from "@itsc/shared";
import { apiFetchSafe } from "./client";
import { galleryContent } from "@/lib/mock/gallery";

interface ApiImage {
  id: string;
  albumId: string;
  imageUrl: string;
  caption: string | null;
  altText: string;
  uploadedAt: string;
}

interface ApiAlbumDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  images: ApiImage[];
}

interface ApiAlbumList {
  albums: { id: string; title: string; slug: string }[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

function toImages(images: ApiImage[]): GalleryImage[] {
  return images.map((image) => {
    const result: GalleryImage = { id: image.id, alt: image.altText };
    result.src = image.imageUrl;
    if (image.caption) result.caption = image.caption;
    return result;
  });
}

function toAlbum(album: ApiAlbumDetail): GalleryAlbum {
  const result: GalleryAlbum = {
    id: album.id,
    title: album.title,
    images: toImages(album.images)
  };
  if (album.description) result.description = album.description;
  if (album.coverImage) result.coverImage = { src: album.coverImage, alt: album.title };
  return result;
}

export async function getGalleryContent(): Promise<GalleryContent> {
  const list = await apiFetchSafe<ApiAlbumList>("/gallery/albums?limit=20");

  if (!list?.albums) {
    return galleryContent;
  }

  // Fetch each album's full image set by slug.
  const albumDetails = await Promise.all(
    list.albums.map((album) => apiFetchSafe<ApiAlbumDetail>(`/gallery/albums/${album.slug}`))
  );

  const albums = albumDetails
    .filter((a): a is ApiAlbumDetail => a !== null)
    .map(toAlbum);

  if (albums.length === 0) {
    return galleryContent;
  }

  return {
    ...galleryContent,
    albums
  };
}
