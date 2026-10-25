import type { StorySession } from "./types";
import { STORAGE_KEY } from "./constants";
import { isValidKanjiGrade } from "../theme/preferences";

/** セッションを localStorage に保存する */
export function saveSession(session: StorySession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    console.error("Failed to save session to localStorage");
  }
}

/** localStorage からセッションを読み込む。無効データは削除する */
export function loadSession(): StorySession | null {
  const result = peekSession();
  if (result === null) {
    // raw が存在するのに null → 不正データ。クリーンアップする
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) removeSession();
    } catch { /* ignore */ }
  }
  return result;
}

/** 副作用なしで localStorage のセッションを読み取る（render 内で安全に呼べる） */
export function peekSession(): StorySession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    const migrated = migrateSession(parsed);
    if (!isValidSession(migrated)) return null;
    return migrated;
  } catch {
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

/** textStyle がない古いセッションは hiragana / kanjiGrade=null として扱う */
function migrateSession(value: unknown): unknown {
  if (typeof value !== "object" || value === null) return value;
  const obj = value as Record<string, unknown>;
  if ("textStyle" in obj) return obj;
  return { ...obj, textStyle: "hiragana", kanjiGrade: null };
}

/** shape チェック（steps 内部の必須キーも検証） */
function isValidSession(value: unknown): value is StorySession {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (
    typeof obj["theme"] !== "string" ||
    obj["theme"] === "" ||
    !isValidTextStyleAndGrade(obj["textStyle"], obj["kanjiGrade"]) ||
    !Array.isArray(obj["keywords"]) ||
    !(obj["keywords"] as unknown[]).every((k) => typeof k === "string") ||
    !Array.isArray(obj["steps"]) ||
    (obj["status"] !== "playing" && obj["status"] !== "ended")
  ) {
    return false;
  }

  return (obj["steps"] as unknown[]).every(isValidStep);
}

function isValidTextStyleAndGrade(textStyle: unknown, kanjiGrade: unknown): boolean {
  if (textStyle === "hiragana") return kanjiGrade === null;
  if (textStyle === "kanji") return isValidKanjiGrade(kanjiGrade);
  return false;
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
