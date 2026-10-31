// Server-side data access for Training — fetches from the API, maps to shared
// contracts, and falls back to mock data when the API is unavailable.
import type {
  TrainingCategory,
  TrainingProgramSummary,
  TrainingProgramDetail,
  TrainingProgramsContent
} from "@itsc/shared";
import { apiFetchSafe } from "./client";
import { trainingCategories, trainingPrograms, trainingProgramsContent } from "@/lib/mock/training";

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId?: string | null;
  sortOrder?: number;
  parent?: { id: string; name: string; slug: string } | null;
  children?: ApiCategory[];
  createdAt: string;
  updatedAt: string;
  _count?: { programs: number };
}

export interface ApiProgram {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  code?: string | null;
  sortOrder?: number;
  shortDescription: string;
  fullDescription: string;
  duration: string | null;
  deliveryMode: string | null;
  level: string | null;
  featuredImage: string | null;
  outlineText: string | null;
  outlineFileUrl: string | null;
  isFeatured: boolean;
  objectives?: string[];
  prerequisites?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string; parentId?: string | null };
  author?: { id: string; fullName: string } | null;
}

export interface ApiProgramList {
  programs: ApiProgram[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function toCategory(api: ApiCategory): TrainingCategory {
  const result: TrainingCategory = {
    id: api.id,
    name: api.name,
    slug: api.slug,
    sortOrder: api.sortOrder ?? 0
  };
  if (api.parentId) result.parentId = api.parentId;
  if (api.description) result.description = api.description;
  if (api.children && api.children.length > 0) {
    result.children = api.children.map(toCategory);
  }
  if (api._count?.programs !== undefined) result.count = api._count.programs;
  return result;
}

export function toSummary(api: ApiProgram): TrainingProgramSummary {
  const categoryObj: { id: string; name: string; slug: string; parentId?: string } = {
    id: api.category?.id ?? api.categoryId,
    name: api.category?.name ?? "",
    slug: api.category?.slug ?? ""
  };
  if (api.category?.parentId) {
    categoryObj.parentId = api.category.parentId;
  }

  const result: TrainingProgramSummary = {
    id: api.id,
    title: api.title,
    slug: api.slug,
    sortOrder: api.sortOrder ?? 0,
    shortDescription: api.shortDescription,
    isFeatured: api.isFeatured,
    category: categoryObj
  };
  if (api.code) result.code = api.code;
  if (api.duration) result.duration = api.duration;
  if (api.deliveryMode) result.deliveryMode = api.deliveryMode;
  if (api.level) result.level = api.level;
  if (api.featuredImage) result.featuredImage = { src: api.featuredImage, alt: api.title };
  return result;
}

export function toDetail(api: ApiProgram): TrainingProgramDetail {
  const result: TrainingProgramDetail = {
    ...toSummary(api),
    fullDescription: api.fullDescription,
    objectives: api.objectives && api.objectives.length > 0 ? api.objectives : [],
    prerequisites: api.prerequisites && api.prerequisites.length > 0 ? api.prerequisites : []
  };
  if (api.outlineText) result.outlineText = api.outlineText;
  if (api.outlineFileUrl) result.outlineFileUrl = api.outlineFileUrl;
  return result;
}

export async function getTrainingContent(): Promise<TrainingProgramsContent> {
  const [catApi, progApi] = await Promise.all([
    apiFetchSafe<ApiCategory[]>("/training/categories"),
    apiFetchSafe<ApiProgramList>("/training/programs?status=PUBLISHED&limit=500")
  ]);

  const categories = catApi?.map(toCategory) ?? trainingCategories;
  const programs = progApi?.programs.map(toSummary) ?? trainingProgramsContent.programs;

  return {
    ...trainingProgramsContent,
    categories,
    programs
  };
}

export async function getTrainingProgram(slug: string): Promise<TrainingProgramDetail | null> {
  const api = await apiFetchSafe<ApiProgram>(`/training/programs/${slug}`);

  if (!api) {
    return trainingPrograms.find((p) => p.slug === slug) ?? null;
  }

  return toDetail(api);
}
