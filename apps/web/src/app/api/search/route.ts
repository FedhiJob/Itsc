import { NextResponse } from "next/server";
import { getTrainingContent } from "@/lib/api/training";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { categories, programs } = await getTrainingContent();

    const searchIndex = {
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c.count ?? 0,
      })),
      programs: programs.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        code: p.code ?? null,
        category: p.category.name,
        categorySlug: p.category.slug,
        duration: p.duration ?? null,
        level: p.level ?? null,
      })),
    };

    return NextResponse.json(searchIndex, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Failed to generate search index:", error);
    return NextResponse.json({ categories: [], programs: [] }, { status: 500 });
  }
}
