import type { OnboardingAnswer } from "./types";

/** オンボーディングの答えと漢字の学年を保存するキー */
export const PREFERENCES_KEY = "ohanashi-palette.preferences";

export const MIN_KANJI_GRADE = 1;
export const MAX_KANJI_GRADE = 6;
export const DEFAULT_KANJI_GRADE = 3;

export type Preferences = {
  /** 小学○年生までの漢字（1〜6） */
  kanjiGrade: number;
  /** オンボーディングの答え（まだ答えていなければ null） */
  answers: OnboardingAnswer[] | null;
};

const DEFAULT_PREFERENCES: Preferences = {
  kanjiGrade: DEFAULT_KANJI_GRADE,
  answers: null,
};

export function isValidKanjiGrade(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_KANJI_GRADE &&
    value <= MAX_KANJI_GRADE
  );
}

export function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (raw === null) return DEFAULT_PREFERENCES;
    const parsed: unknown = JSON.parse(raw);
    const obj = (typeof parsed === "object" && parsed !== null ? parsed : {}) as Record<string, unknown>;
    return {
      kanjiGrade: isValidKanjiGrade(obj["kanjiGrade"]) ? obj["kanjiGrade"] : DEFAULT_KANJI_GRADE,
      answers: isValidAnswers(obj["answers"]) ? obj["answers"] : null,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/** 一部だけ更新して保存する */
export function savePreferences(update: Partial<Preferences>): void {
  try {
    const next: Preferences = { ...loadPreferences(), ...update };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
  } catch {
    console.error("Failed to save preferences to localStorage");
  }
}

function isValidAnswers(value: unknown): value is OnboardingAnswer[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((a: unknown) => {
      if (typeof a !== "object" || a === null) return false;
      const obj = a as Record<string, unknown>;
      return (
        typeof obj["questionId"] === "string" &&
        typeof obj["choiceId"] === "string" &&
        typeof obj["label"] === "string" &&
        (obj["textStyle"] === "hiragana" || obj["textStyle"] === "kanji")
      );
    })
  );
}
