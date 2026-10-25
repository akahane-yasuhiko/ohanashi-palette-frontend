import { useCallback, useRef, useState } from "react";
import { HomePage } from "../pages/HomePage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { ThemeSuggestPage } from "../pages/ThemeSuggestPage";
import { SetupPage } from "../pages/SetupPage";
import { LoadingPage } from "../pages/LoadingPage";
import { StoryPage } from "../pages/StoryPage";
import { EndingPage } from "../pages/EndingPage";
import { createSession, addStep, selectChoice, endSession } from "../features/story/session";
import { saveSession, loadSession, removeSession } from "../features/story/storage";
import { loadPreferences } from "../features/theme/preferences";
import type { Theme, TextStyle, StorySession, StoryNextResponse } from "../features/story/types";
import type { OnboardingAnswer, SuggestedTheme } from "../features/theme/types";
import type { ScreenName } from "./routes";

type PendingMode = "start" | "continue" | "finish";

export function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const [session, setSession] = useState<StorySession | null>(null);
  const [pendingMode, setPendingMode] = useState<PendingMode>("start");
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);
  const [generatedTheme, setGeneratedTheme] = useState<SuggestedTheme | null>(null);
  const [initialFixedThemeId, setInitialFixedThemeId] = useState<Theme | null>(null);

  const sessionRef = useRef(session);
  sessionRef.current = session;

  const navigate = useCallback((next: ScreenName) => {
    if (next === "setup") {
      // 画面から Setup へ直接行くときは固定テーマを選ぶ
      setGeneratedTheme(null);
      setInitialFixedThemeId(null);
    }
    setScreen(next);
  }, []);

  const handleOnboardingComplete = useCallback((all: OnboardingAnswer[]) => {
    setAnswers(all);
    setScreen("themeSuggest");
  }, []);

  const handleSelectGeneratedTheme = useCallback((theme: SuggestedTheme) => {
    setGeneratedTheme(theme);
    setInitialFixedThemeId(null);
    setScreen("setup");
  }, []);

  const handleSelectFixedTheme = useCallback((themeId: Theme) => {
    setGeneratedTheme(null);
    setInitialFixedThemeId(themeId);
    setScreen("setup");
  }, []);

  /** 生成テーマで遊んだら ThemeSuggest で新しい候補を、固定テーマなら Setup へ */
  const handlePlayAgain = useCallback(() => {
    if (sessionRef.current?.themeSource !== "generated") {
      navigate("setup");
      return;
    }
    const saved = answers.length > 0 ? answers : loadPreferences().answers;
    if (!saved) {
      setScreen("onboarding");
      return;
    }
    setAnswers(saved);
    setScreen("themeSuggest");
  }, [answers, navigate]);

  const handleStart = useCallback(
    (theme: Theme, keywords: string[], textStyle: TextStyle, kanjiGrade: number | null) => {
      const themeSource = generatedTheme ? "generated" : "fixed";
      const newSession = createSession(theme, themeSource, keywords, textStyle, kanjiGrade);
      setSession(newSession);
      saveSession(newSession);
      setPendingMode("start");
      navigate("loading");
    },
    [navigate, generatedTheme],
  );

  const handleResume = useCallback(() => {
    const saved = loadSession();
    if (!saved || saved.status !== "playing") return;

    setSession(saved);

    const lastStep = saved.steps[saved.steps.length - 1];
    if (!lastStep) {
      // step なし（Setup 直後）→ 最初のステップ生成
      setPendingMode("start");
      navigate("loading");
    } else if (lastStep.choices.length === 0 || lastStep.selectedChoiceId !== null) {
      // 分岐なしステップ or 選択済み → 次ステップ生成
      setPendingMode("continue");
      navigate("loading");
    } else {
      // 選択肢あり・未選択 → Story で選択を待つ
      navigate("story");
    }
  }, [navigate]);

  const handleStepFetched = useCallback((response: StoryNextResponse) => {
    const prev = sessionRef.current;
    if (!prev) return;

    const withStep = addStep(prev, response);

    if (response.isEnd) {
      // 締め文ステップ: status=ended にしたうえで Story で 1 回表示し、
      // ユーザーが「おわりへ」を押したら Ending に進む。
      const ended = endSession(withStep);
      setSession(ended);
      removeSession();
      setScreen("story");
    } else {
      setSession(withStep);
      saveSession(withStep);
      setScreen("story");
    }
  }, []);

  const handleChoice = useCallback(
    (choiceId: string, choiceLabel: string) => {
      const prev = sessionRef.current;
      if (!prev) return;
      const updated = selectChoice(prev, choiceId, choiceLabel);
      setSession(updated);
      saveSession(updated);
      setPendingMode("continue");
      navigate("loading");
    },
    [navigate],
  );

  const handleNext = useCallback(() => {
    setPendingMode("continue");
    navigate("loading");
  }, [navigate]);

  const handleFinish = useCallback(() => {
    setPendingMode("finish");
    navigate("loading");
  }, [navigate]);

  const handleGoEnding = useCallback(() => {
    navigate("ending");
  }, [navigate]);

  switch (screen) {
    case "home":
      return <HomePage navigate={navigate} onResume={handleResume} />;
    case "onboarding":
      return <OnboardingPage onComplete={handleOnboardingComplete} />;
    case "themeSuggest":
      return (
        <ThemeSuggestPage
          answers={answers}
          onSelectTheme={handleSelectGeneratedTheme}
          onSelectFixedTheme={handleSelectFixedTheme}
          navigate={navigate}
        />
      );
    case "setup":
      return (
        <SetupPage
          generatedTheme={generatedTheme}
          initialFixedThemeId={initialFixedThemeId}
          onStart={handleStart}
        />
      );
    case "loading":
      return (
        <LoadingPage
          session={session}
          mode={pendingMode}
          onStepFetched={handleStepFetched}
          navigate={navigate}
        />
      );
    case "story":
      return (
        <StoryPage
          session={session}
          onChoice={handleChoice}
          onNext={handleNext}
          onFinish={handleFinish}
          onGoEnding={handleGoEnding}
        />
      );
    case "ending":
      return <EndingPage navigate={navigate} onPlayAgain={handlePlayAgain} />;
  }
}
