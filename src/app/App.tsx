import { useCallback, useState } from "react";
import { HomePage } from "../pages/HomePage";
import { SetupPage } from "../pages/SetupPage";
import { LoadingPage } from "../pages/LoadingPage";
import { StoryPage } from "../pages/StoryPage";
import { EndingPage } from "../pages/EndingPage";
import { createSession } from "../features/story/session";
import { saveSession } from "../features/story/storage";
import type { Theme, StorySession } from "../features/story/types";
import type { ScreenName } from "./routes";

/** Phase 1 暫定: 3ステップ目で終了扱い。Phase 5 で API の isEnd に置き換え予定 */
const DEMO_MAX_STEPS = 3;

export function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const [stepCount, setStepCount] = useState(0);
  const [session, setSession] = useState<StorySession | null>(null);

  const navigate = useCallback((next: ScreenName) => {
    if (next === "loading") {
      setStepCount((c) => c + 1);
    }
    if (next === "setup" || next === "home") {
      setStepCount(0);
    }
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

  const loadingDestination: ScreenName =
    stepCount >= DEMO_MAX_STEPS ? "ending" : "story";

  switch (screen) {
    case "home":
      return <HomePage navigate={navigate} />;
    case "setup":
      return <SetupPage onStart={handleStart} />;
    case "loading":
      return <LoadingPage destination={loadingDestination} navigate={navigate} />;
    case "story":
      return <StoryPage navigate={navigate} session={session} />;
    case "ending":
      return <EndingPage navigate={navigate} />;
  }
}
