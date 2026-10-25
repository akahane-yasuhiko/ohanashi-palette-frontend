import { useState, useCallback } from "react";
import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import { ThemeSelector } from "../components/setup/ThemeSelector";
import { KeywordSelector } from "../components/setup/KeywordSelector";
import {
  THEME_CATALOG,
  MIN_KEYWORDS,
} from "../features/story/constants";
import { loadPreferences } from "../features/theme/preferences";
import type { TextStyle, Theme } from "../features/story/types";

type Props = {
  onStart: (
    theme: Theme,
    keywords: string[],
    textStyle: TextStyle,
    kanjiGrade: number | null,
  ) => void;
};

export function SetupPage({ onStart }: Props) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleThemeSelect = useCallback((t: Theme) => {
    setTheme(t);
    setKeywords([]);
  }, []);

  const handleKeywordToggle = useCallback((kw: string) => {
    setKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw],
    );
  }, []);

  const entry = THEME_CATALOG.find((e) => e.id === theme);
  const canStart = theme !== null && keywords.length >= MIN_KEYWORDS;

  return (
    <Screen>
      <h2>テーマと ことばを えらぼう</h2>

      <ThemeSelector selected={theme} onSelect={handleThemeSelect} />

      {entry && (
        <KeywordSelector
          candidates={entry.keywords}
          selected={keywords}
          onToggle={handleKeywordToggle}
        />
      )}

      <PrimaryButton
        onClick={() => {
          if (!entry || !canStart) return;
          const kanjiGrade =
            entry.textStyle === "kanji" ? loadPreferences().kanjiGrade : null;
          onStart(entry.id, keywords, entry.textStyle, kanjiGrade);
        }}
        disabled={!canStart}
      >
        おはなしを つくる
      </PrimaryButton>
    </Screen>
  );
}
