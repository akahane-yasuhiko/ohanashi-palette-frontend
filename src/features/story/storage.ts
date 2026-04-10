import type { StorySession, Theme } from "./types";
import { STORAGE_KEY } from "./constants";

const VALID_THEMES: readonly string[] = ["でんしゃ", "うみ"] satisfies Theme[];

/** セッションを localStorage に保存する */
export function saveSession(session: StorySession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    console.error("Failed to save session to localStorage");
  }
}

/** localStorage からセッションを読み込む。無ければ null */
export function loadSession(): StorySession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isValidSession(parsed)) {
      console.warn("Invalid session in localStorage, discarding");
      removeSession();
      return null;
    }
    return parsed;
  } catch {
    console.error("Failed to load session from localStorage, discarding");
    removeSession();
    return null;
  }
}

/** localStorage からセッションを削除する */
export function removeSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error("Failed to remove session from localStorage");
  }
}

/** shape チェック（steps 内部の必須キーも検証） */
function isValidSession(value: unknown): value is StorySession {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (
    typeof obj["theme"] !== "string" ||
    !VALID_THEMES.includes(obj["theme"]) ||
    !Array.isArray(obj["keywords"]) ||
    !(obj["keywords"] as unknown[]).every((k) => typeof k === "string") ||
    !Array.isArray(obj["steps"]) ||
    (obj["status"] !== "playing" && obj["status"] !== "ended")
  ) {
    return false;
  }

  return (obj["steps"] as unknown[]).every(isValidStep);
}

function isValidStep(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s["stepIndex"] === "number" &&
    typeof s["text"] === "string" &&
    Array.isArray(s["choices"]) &&
    (s["choices"] as unknown[]).every(isValidChoice) &&
    typeof s["isEnd"] === "boolean" &&
    "selectedChoiceId" in s &&
    (s["selectedChoiceId"] === null || typeof s["selectedChoiceId"] === "string") &&
    "selectedChoiceLabel" in s &&
    (s["selectedChoiceLabel"] === null || typeof s["selectedChoiceLabel"] === "string")
  );
}

function isValidChoice(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  return typeof c["id"] === "string" && typeof c["label"] === "string";
}
