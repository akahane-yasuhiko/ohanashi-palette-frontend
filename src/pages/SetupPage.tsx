import { useState, useCallback } from "react";
import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import { ThemeSelector } from "../components/setup/ThemeSelector";
import { KeywordSelector } from "../components/setup/KeywordSelector";
import { KanjiGradeSelect } from "../components/theme/KanjiGradeSelect";
import {
  THEME_CATALOG,
  MIN_KEYWORDS,
} from "../features/story/constants";
import { loadPreferences, savePreferences } from "../features/theme/preferences";
import type { SuggestedTheme } from "../features/theme/types";
import type { TextStyle, Theme } from "../features/story/types";

type Props = {
  /** 生成テーマを選んできた場合はそのテーマ（テーマ選択は出さず、学年も確定済み） */
  generatedTheme: SuggestedTheme | null;
  /** 固定テーマを先に選んでおく場合の id */
  initialFixedThemeId: Theme | null;
  onStart: (
    theme: Theme,
    keywords: string[],
    textStyle: TextStyle,
    kanjiGrade: number | null,
  ) => void;
};

export function SetupPage({ generatedTheme, initialFixedThemeId, onStart }: Props) {
  const [fixedThemeId, setFixedThemeId] = useState<Theme | null>(initialFixedThemeId);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [grade, setGrade] = useState(() => loadPreferences().kanjiGrade);

  const handleThemeSelect = useCallback((t: Theme) => {
    setFixedThemeId(t);
    setKeywords([]);
  }, []);

  const handleKeywordToggle = useCallback((kw: string) => {
    setKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw],
    );
  }, []);

  const handleGradeChange = useCallback((g: number) => {
    setGrade(g);
    savePreferences({ kanjiGrade: g });
  }, []);

  const fixedEntry = THEME_CATALOG.find((e) => e.id === fixedThemeId);
  const entry = generatedTheme ?? fixedEntry;
  const canStart = entry !== undefined && keywords.length >= MIN_KEYWORDS;
  const showGradeSelect = !generatedTheme && fixedEntry?.textStyle === "kanji";

  const handleStart = () => {
    if (!entry || !canStart) return;
    if (generatedTheme) {
      onStart(generatedTheme.label, keywords, generatedTheme.textStyle, generatedTheme.kanjiGrade);
      return;
    }
    // 固定テーマの学年は開始ボタンを押した時点で確定する
    const kanjiGrade = entry.textStyle === "kanji" ? grade : null;
    onStart(entry.label, keywords, entry.textStyle, kanjiGrade);
  };

  return (
    <Screen>
      {showGradeSelect && <KanjiGradeSelect grade={grade} onChange={handleGradeChange} />}

      {generatedTheme ? (
        <>
          <h2>{generatedTheme.label}</h2>
          {generatedTheme.textStyle === "kanji" && (
            <p className="kanji-note">小学{generatedTheme.kanjiGrade}年生までの漢字</p>
          )}
        </>
      ) : (
        <>
          <h2>テーマと ことばを えらぼう</h2>
          <ThemeSelector selected={fixedThemeId} onSelect={handleThemeSelect} />
        </>
      )}

      {entry && (
        <KeywordSelector
          candidates={entry.keywords}
          selected={keywords}
          onToggle={handleKeywordToggle}
        />
      )}

      <PrimaryButton onClick={handleStart} disabled={!canStart}>
        おはなしを つくる
      </PrimaryButton>
    </Screen>
  );
}
