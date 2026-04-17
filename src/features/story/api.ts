import type { StoryNextRequest, StoryNextResponse } from "./types";

function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
  if (!base) return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export async function fetchNextStep(
  request: StoryNextRequest,
): Promise<StoryNextResponse> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/api/story/next`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json() as Promise<StoryNextResponse>;
}
