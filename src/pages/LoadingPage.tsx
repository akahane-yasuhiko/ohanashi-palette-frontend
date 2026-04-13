import { useEffect, useRef, useState } from "react";
import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import { fetchNextStep } from "../features/story/api";
import { buildHistory } from "../features/story/session";
import type { StorySession, StoryNextResponse } from "../features/story/types";
import type { NavigateFn } from "../app/routes";

type Props = {
  session: StorySession | null;
  onStepFetched: (response: StoryNextResponse) => void;
  navigate: NavigateFn;
};

export function LoadingPage({ session, onStepFetched, navigate }: Props) {
  const [hasError, setHasError] = useState(false);
  const called = useRef(false);

  useEffect(() => {
    if (called.current || !session) return;
    called.current = true;

    const mode = session.steps.length === 0 ? "start" : "continue";
    fetchNextStep({
      mode,
      theme: session.theme,
      keywords: session.keywords,
      history: buildHistory(session),
    })
      .then(onStepFetched)
      .catch((err: unknown) => {
        console.error("fetchNextStep failed:", err);
        setHasError(true);
      });
  }, [session, onStepFetched]);

  if (hasError) {
    return (
      <Screen>
        <p>ごめんね、もういちど やってみよう</p>
        <PrimaryButton onClick={() => navigate("home")}>はじめにもどる</PrimaryButton>
      </Screen>
    );
  }

  return (
    <Screen>
      <h2>おはなしを つくってるよ…</h2>
    </Screen>
  );
}
