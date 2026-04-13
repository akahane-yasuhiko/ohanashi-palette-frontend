import { useCallback, useRef, useState } from "react";
import { HomePage } from "../pages/HomePage";
import { SetupPage } from "../pages/SetupPage";
import { LoadingPage } from "../pages/LoadingPage";
import { StoryPage } from "../pages/StoryPage";
import { EndingPage } from "../pages/EndingPage";
import { createSession, addStep, selectChoice, endSession } from "../features/story/session";
import { saveSession, loadSession, removeSession } from "../features/story/storage";
import type { Theme, StorySession, StoryNextResponse } from "../features/story/types";
import type { ScreenName } from "./routes";

export function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const [session, setSession] = useState<StorySession | null>(null);

  const sessionRef = useRef(session);
  sessionRef.current = session;

  const navigate = useCallback((next: ScreenName) => {
    setScreen(next);
  }, []);

  const handleStart = useCallback(
    (theme: Theme, keywords: string[]) => {
      const newSession = createSession(theme, keywords);
      setSession(newSession);
      saveSession(newSession);
      navigate("loading");
    },
    [navigate],
  );

  const handleResume = useCallback(() => {
    const saved = loadSession();
    if (!saved || saved.status !== "playing") return;

    setSession(saved);

    const lastStep = saved.steps[saved.steps.length - 1];
    if (!lastStep) {
      // step なし（Setup 直後）→ 最初のステップ生成
      navigate("loading");
    } else if (lastStep.choices.length === 0 || lastStep.selectedChoiceId !== null) {
      // 分岐なしステップ or 選択済み → 次ステップ生成
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
      const ended = endSession(withStep);
      setSession(ended);
      removeSession();
      setScreen("ending");
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
      navigate("loading");
    },
    [navigate],
  );

  const handleNext = useCallback(() => {
    navigate("loading");
  }, [navigate]);

  switch (screen) {
    case "home":
      return <HomePage navigate={navigate} onResume={handleResume} />;
    case "setup":
      return <SetupPage onStart={handleStart} />;
    case "loading":
      return (
        <LoadingPage
          session={session}
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
        />
      );
    case "ending":
      return <EndingPage navigate={navigate} />;
  }
}
