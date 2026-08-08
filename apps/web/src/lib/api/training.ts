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

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { programs: number };
}

interface ApiProgram {
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
  status: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string };
  author?: { id: string; fullName: string } | null;
}

interface ApiProgramList {
  programs: ApiProgram[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

function toCategory(api: ApiCategory): TrainingCategory {
  const result: TrainingCategory = {
    id: api.id,
    name: api.name,
    slug: api.slug
  };
  if (api.description) result.description = api.description;
  if (api._count?.programs !== undefined) result.count = api._count?.programs;
  return result;
}

function toSummary(api: ApiProgram): TrainingProgramSummary {
  const result: TrainingProgramSummary = {
    id: api.id,
    title: api.title,
    slug: api.slug,
    shortDescription: api.shortDescription,
    isFeatured: api.isFeatured,
    category: api.category ?? { id: api.categoryId, name: "", slug: "" }
  };
  if (api.duration) result.duration = api.duration;
  if (api.deliveryMode) result.deliveryMode = api.deliveryMode;
  if (api.level) result.level = api.level;
  return result;
}

function toDetail(api: ApiProgram): TrainingProgramDetail {
  const result: TrainingProgramDetail = {
    ...toSummary(api),
    fullDescription: api.fullDescription,
    objectives: [],
    prerequisites: []
  };
  if (api.featuredImage) result.featuredImage = { src: api.featuredImage, alt: api.title };
  return result;
}

export async function getTrainingContent(): Promise<TrainingProgramsContent> {
  const [catApi, progApi] = await Promise.all([
    apiFetchSafe<ApiCategory[]>("/training/categories"),
    apiFetchSafe<ApiProgramList>("/training/programs?status=PUBLISHED&isFeatured=true&limit=50")
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
