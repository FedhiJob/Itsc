// Server-side API client for public content.
// Fetches from the backend API and unwraps the { success, message, data } envelope.
// On failure (API unreachable / dev with no data), callers fall back to mock data.

import { siteConfig } from "@/config/site";

export interface ApiSuccess<TData> {
  success: true;
  message: string;
  data: TData;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${siteConfig.apiUrl}${path}`, {
    // Revalidate every 60s so content updates are picked up without a redeploy.
    next: { revalidate: 60 }
  });

  const body = (await response.json().catch(() => null)) as ApiSuccess<T> | null;

  if (!response.ok) {
    throw new ApiError(body?.message ?? "API request failed.", response.status);
  }

  return body!.data as T;
}

/**
 * POST to the API, returning the unwrapped `data` payload. Throws on non-2xx.
 */
export async function apiPost<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${siteConfig.apiUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const body = (await response.json().catch(() => null)) as ApiSuccess<T> | null;

  if (!response.ok) {
    throw new ApiError(body?.message ?? "API request failed.", response.status);
  }

  return body!.data as T;
}

/**
 * Fetch from the API, returning `null` if the API is unavailable so callers
 * can fall back to mock data.
 */
export async function apiFetchSafe<T>(path: string): Promise<T | null> {
  try {
    return await apiFetch<T>(path);
  } catch (err) {
    console.warn(`API fallback for ${path}:`, err instanceof Error ? err.message : err);
    return null;
  }
}
