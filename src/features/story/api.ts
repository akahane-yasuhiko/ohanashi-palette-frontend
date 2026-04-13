import type { StoryNextRequest, StoryNextResponse } from "./types";

export async function fetchNextStep(
  request: StoryNextRequest,
): Promise<StoryNextResponse> {
  const res = await fetch("/api/story/next", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json() as Promise<StoryNextResponse>;
}
