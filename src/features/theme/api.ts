import { getApiBaseUrl } from "../../utils/apiBaseUrl";
import type {
  OnboardingQuestion,
  SuggestedTheme,
  ThemeQuestionsRequest,
  ThemeSuggestRequest,
} from "./types";

async function postJson(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchThemeQuestions(
  request: ThemeQuestionsRequest,
): Promise<OnboardingQuestion[]> {
  const data = (await postJson("/api/theme/questions", request)) as { questions?: unknown };
  if (!Array.isArray(data.questions) || data.questions.length !== 2 || !data.questions.every(isValidQuestion)) {
    throw new Error("Invalid theme/questions response");
  }
  return data.questions;
}

export async function fetchThemeSuggestions(
  request: ThemeSuggestRequest,
): Promise<SuggestedTheme[]> {
  const data = (await postJson("/api/theme/suggest", request)) as { themes?: unknown };
  if (!Array.isArray(data.themes) || data.themes.length !== 4 || !data.themes.every(isValidTheme)) {
    throw new Error("Invalid theme/suggest response");
  }
  return data.themes;
}

function isTextStyle(value: unknown): boolean {
  return value === "hiragana" || value === "kanji";
}

function isValidQuestion(value: unknown): value is OnboardingQuestion {
  if (typeof value !== "object" || value === null) return false;
  const q = value as Record<string, unknown>;
  return (
    typeof q["id"] === "string" &&
    typeof q["text"] === "string" &&
    Array.isArray(q["choices"]) &&
    q["choices"].length === 4 &&
    q["choices"].every((c: unknown) => {
      if (typeof c !== "object" || c === null) return false;
      const obj = c as Record<string, unknown>;
      return typeof obj["id"] === "string" && typeof obj["label"] === "string" && isTextStyle(obj["textStyle"]);
    })
  );
}

function isValidTheme(value: unknown): value is SuggestedTheme {
  if (typeof value !== "object" || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t["id"] === "string" &&
    typeof t["label"] === "string" &&
    isTextStyle(t["textStyle"]) &&
    (t["kanjiGrade"] === null || typeof t["kanjiGrade"] === "number") &&
    Array.isArray(t["keywords"]) &&
    t["keywords"].length > 0 &&
    t["keywords"].every((k: unknown) => typeof k === "string")
  );
}
