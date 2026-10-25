import { useCallback, useEffect, useState } from "react";
import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import { LoadingMessage } from "../components/layout/LoadingMessage";
import { KanjiGradeSelect } from "../components/theme/KanjiGradeSelect";
import { THEME_CATALOG } from "../features/story/constants";
import { fetchThemeSuggestions } from "../features/theme/api";
import { loadPreferences, savePreferences } from "../features/theme/preferences";
import type { OnboardingAnswer, SuggestedTheme } from "../features/theme/types";
import type { NavigateFn } from "../app/routes";

type Props = {
  answers: OnboardingAnswer[];
  onSelectTheme: (theme: SuggestedTheme) => void;
  /** 生成に失敗したとき、固定テーマを選んだら Setup へ */
  onSelectFixedTheme: (themeId: string) => void;
  navigate: NavigateFn;
};

type Request = { kanjiGrade: number; excludeThemes: string[]; key: number };

const THEME_LOADING_MESSAGES = [
  "テーマを かんがえてるよ…",
  "どんな テーマが でるかな…",
  "もうすこし まってね…",
];

export function ThemeSuggestPage({ answers, onSelectTheme, onSelectFixedTheme, navigate }: Props) {
  const [request, setRequest] = useState<Request>(() => ({
    kanjiGrade: loadPreferences().kanjiGrade,
    excludeThemes: [],
    key: 0,
  }));
  const [themes, setThemes] = useState<SuggestedTheme[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setThemes(null);
    setHasError(false);
    fetchThemeSuggestions({
      answers,
      kanjiGrade: request.kanjiGrade,
      excludeThemes: request.excludeThemes,
    })
      .then((result) => {
        if (!cancelled) setThemes(result);
      })
      .catch((err: unknown) => {
        console.error("fetchThemeSuggestions failed:", err);
        if (!cancelled) setHasError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [answers, request]);

  const handleGradeChange = useCallback((g: number) => {
    savePreferences({ kanjiGrade: g });
    setRequest((prev) => ({ kanjiGrade: g, excludeThemes: [], key: prev.key + 1 }));
  }, []);

  const handleOtherThemes = useCallback(() => {
    if (!themes) return;
    setRequest((prev) => ({ ...prev, excludeThemes: themes.map((t) => t.label), key: prev.key + 1 }));
  }, [themes]);

  if (hasError) {
    return (
      <Screen>
        <p>ごめんね、テーマが つくれなかったよ</p>
        <p className="setup-label">この なかから えらんでね</p>
        <div className="card-grid">
          {THEME_CATALOG.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="selectable-card"
              onClick={() => onSelectFixedTheme(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <div className="button-row">
          <PrimaryButton onClick={() => setRequest((prev) => ({ ...prev, key: prev.key + 1 }))}>
            もういちど やってみる
          </PrimaryButton>
          <PrimaryButton onClick={() => navigate("home")}>はじめに もどる</PrimaryButton>
        </div>
      </Screen>
    );
  }

  if (!themes) {
    return (
      <Screen>
        <LoadingMessage messages={THEME_LOADING_MESSAGES} />
      </Screen>
    );
  }

  const hasKanjiTheme = themes.some((t) => t.textStyle === "kanji");

  return (
    <Screen>
      {hasKanjiTheme && <KanjiGradeSelect grade={request.kanjiGrade} onChange={handleGradeChange} />}
      <h2>どの テーマで あそぶ？</h2>
      <div className="card-grid">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className="selectable-card theme-card"
            onClick={() => onSelectTheme(theme)}
          >
            <span>{theme.label}</span>
            {theme.textStyle === "kanji" && theme.kanjiGrade !== null && (
              <span className="kanji-note">小学{theme.kanjiGrade}年生までの漢字</span>
            )}
          </button>
        ))}
      </div>
      <button type="button" className="end-button" onClick={handleOtherThemes}>
        ほかの テーマ
      </button>
    </Screen>
  );
}
