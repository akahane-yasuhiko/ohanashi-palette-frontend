/** オンボーディングの答えと漢字の学年を保存するキー */
export const PREFERENCES_KEY = "ohanashi-palette.preferences";

export const MIN_KANJI_GRADE = 1;
export const MAX_KANJI_GRADE = 6;
export const DEFAULT_KANJI_GRADE = 3;

export type Preferences = {
  /** 小学○年生までの漢字（1〜6） */
  kanjiGrade: number;
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
    if (raw === null) return { kanjiGrade: DEFAULT_KANJI_GRADE };
    const parsed: unknown = JSON.parse(raw);
    const obj = (typeof parsed === "object" && parsed !== null ? parsed : {}) as Record<string, unknown>;
    return {
      kanjiGrade: isValidKanjiGrade(obj["kanjiGrade"]) ? obj["kanjiGrade"] : DEFAULT_KANJI_GRADE,
    };
  } catch {
    return { kanjiGrade: DEFAULT_KANJI_GRADE };
  }
}

export function savePreferences(preferences: Preferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    console.error("Failed to save preferences to localStorage");
  }
}
