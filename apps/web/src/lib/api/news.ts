// Server-side data access for News — fetches from the API, maps to shared contracts,
// and falls back to mock data when the API is unavailable.
import type { NewsArticleSummary, NewsArticleDetail, NewsContent } from "@itsc/shared";
import { apiFetchSafe } from "./client";
import { newsArticles, newsContent } from "@/lib/mock/news";

interface ApiArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string | null;
  publishedAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; fullName: string } | null;
}

interface ApiArticleList {
  articles: ApiArticle[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

function toSummary(article: ApiArticle): NewsArticleSummary {
  const result: NewsArticleSummary = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    date: article.publishedAt ?? article.createdAt,
    category: "News"
  };
  if (article.featuredImage) result.featuredImage = { src: article.featuredImage, alt: article.title };
  return result;
}

function toDetail(article: ApiArticle): NewsArticleDetail {
  const result: NewsArticleDetail = {
    ...toSummary(article),
    content: article.content ? [article.content] : []
  };
  if (article.author?.fullName) result.author = article.author.fullName;
  return result;
}

export async function getNewsContent(): Promise<NewsContent> {
  const api = await apiFetchSafe<ApiArticleList>("/news?status=PUBLISHED&limit=50");

  if (!api?.articles) {
    return newsContent;
  }

  return {
    ...newsContent,
    articles: api.articles.map(toSummary)
  };
}

export async function getNewsArticle(slug: string): Promise<NewsArticleDetail | null> {
  const api = await apiFetchSafe<ApiArticle>(`/news/${slug}`);

  if (!api) {
    return newsArticles.find((a) => a.slug === slug) ?? null;
  }

  return toDetail(api);
}
