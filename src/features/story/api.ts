import type { StoryNextRequest, StoryNextResponse } from "./types";
import { getApiBaseUrl } from "../../utils/apiBaseUrl";

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
