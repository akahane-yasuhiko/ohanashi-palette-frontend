import { useEffect, useState } from "react";
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

const LOADING_MESSAGES = [
  "おはなしを つくってるよ…",
  "どんな おはなしに なるかな…",
  "もうすこし まってね…",
];

export function LoadingPage({ session, onStepFetched, navigate }: Props) {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // 文言を 2.5 秒ごとに切り替え
  useEffect(() => {
    const id = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!session) return;

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
  }, [session, onStepFetched, retryCount]);

  if (hasError) {
    return (
      <Screen>
        <p>ごめんね、うまく いかなかったみたい</p>
        <div className="button-row">
          <PrimaryButton onClick={() => {
            setHasError(false);
            setRetryCount((c) => c + 1);
          }}>
            もういちど やってみる
          </PrimaryButton>
          <PrimaryButton onClick={() => navigate("home")}>
            はじめに もどる
          </PrimaryButton>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <h2 className="loading-text">{LOADING_MESSAGES[messageIndex]}</h2>
    </Screen>
  );
}
