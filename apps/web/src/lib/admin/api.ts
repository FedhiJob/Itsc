// Admin API client — handles login and authenticated requests to the backend.
import { siteConfig } from "@/config/site";
import { getToken, clearSession, type LoginResponse } from "./auth";

export class ApiError extends Error {
  status: number;
  code: string | undefined;

  constructor(message: string, status: number, code: string | undefined) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiSuccess<TData> {
  success: true;
  message: string;
  data: TData;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined)
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${siteConfig.apiUrl}${path}`, {
    ...options,
    headers
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // If the token is invalid/expired, clear the session.
    if (response.status === 401) {
      clearSession();
    }
    const message = body?.message ?? "An unexpected error occurred.";
    const code = body?.errors?.[0]?.code;
    throw new ApiError(message, response.status, code);
  }

  return body as T;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type InquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string | null;
  publishedAt: string | null;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; fullName: string } | null;
}

export interface NewsListResponse {
  articles: NewsArticle[];
  pagination: Pagination;
}

export interface TrainingCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { programs: number };
}

export interface TrainingProgram {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  duration: string | null;
  deliveryMode: string | null;
  level: string | null;
  featuredImage: string | null;
  isFeatured: boolean;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string };
  author?: { id: string; fullName: string } | null;
}

export interface TrainingProgramsResponse {
  programs: TrainingProgram[];
  pagination: Pagination;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { images: number };
}

export interface GalleryAlbumListResponse {
  albums: GalleryAlbum[];
  pagination: Pagination;
}

export interface GalleryImage {
  id: string;
  albumId: string;
  imageUrl: string;
  caption: string | null;
  altText: string;
  uploadedAt: string;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  organization: string | null;
  subject: string;
  message: string;
  status: InquiryStatus;
  submittedAt: string;
  updatedAt: string;
}

export interface InquiriesResponse {
  inquiries: ContactInquiry[];
  pagination: Pagination;
}

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

export const adminApi = {
  // --- Uploads ---
  async uploadImage(file: File): Promise<{ url: string; provider: string; publicId?: string }> {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${siteConfig.apiUrl}/upload/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        clearSession();
      }
      const message = body?.message ?? "Image upload failed.";
      const code = body?.errors?.[0]?.code;
      throw new ApiError(message, response.status, code);
    }

    return (body as ApiSuccess<{ url: string; provider: string; publicId?: string }>).data;
  },

  // --- Auth ---
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await request<ApiSuccess<LoginResponse>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    return res.data;
  },

  async getMe(): Promise<{ id: string; fullName: string; email: string; role: string }> {
    const res = await request<ApiSuccess<{ id: string; fullName: string; email: string; role: string }>>("/auth/me");
    return res.data;
  },

  // --- Training Categories ---
  async listCategories(): Promise<TrainingCategory[]> {
    const res = await request<ApiSuccess<TrainingCategory[]>>("/training/categories");
    return res.data;
  },

  async createCategory(input: { name: string; slug: string; description?: string }) {
    return request("/training/categories", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async updateCategory(id: string, input: { name?: string; slug?: string; description?: string }) {
    return request(`/training/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  },

  async deleteCategory(id: string) {
    return request(`/training/categories/${id}`, { method: "DELETE" });
  },

  // --- Training Programs ---
  async listPrograms(params: Record<string, string | number | boolean> = {}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      query.set(key, String(value));
    }
    const res = await request<ApiSuccess<TrainingProgramsResponse>>(
      `/training/programs?${query.toString()}`
    );
    return res.data;
  },

  async createProgram(input: Record<string, unknown>) {
    return request("/training/programs", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async updateProgram(id: string, input: Record<string, unknown>) {
    return request(`/training/programs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  },

  async deleteProgram(id: string) {
    return request(`/training/programs/${id}`, { method: "DELETE" });
  },

  // --- News ---
  async listNews(params: Record<string, string | number> = {}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      query.set(key, String(value));
    }
    const res = await request<ApiSuccess<NewsListResponse>>(`/news?${query.toString()}`);
    return res.data;
  },

  async createNews(input: Record<string, unknown>) {
    return request("/news", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async updateNews(id: string, input: Record<string, unknown>) {
    return request(`/news/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  },

  async deleteNews(id: string) {
    return request(`/news/${id}`, { method: "DELETE" });
  },

  // --- Gallery ---
  async listAlbums(params: Record<string, string | number> = {}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      query.set(key, String(value));
    }
    const res = await request<ApiSuccess<GalleryAlbumListResponse>>(
      `/gallery/albums?${query.toString()}`
    );
    return res.data;
  },

  async createAlbum(input: { title: string; slug: string; description?: string; coverImage?: string }) {
    return request("/gallery/albums", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async updateAlbum(id: string, input: Record<string, unknown>) {
    return request(`/gallery/albums/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  },

  async deleteAlbum(id: string) {
    return request(`/gallery/albums/${id}`, { method: "DELETE" });
  },

  // --- Inquiries ---
  async listInquiries(params: Record<string, string | number> = {}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      query.set(key, String(value));
    }
    const res = await request<ApiSuccess<InquiriesResponse>>(
      `/contact/inquiries?${query.toString()}`
    );
    return res.data;
  },

  async updateInquiry(id: string, input: { status: InquiryStatus }) {
    return request(`/contact/inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  }
};