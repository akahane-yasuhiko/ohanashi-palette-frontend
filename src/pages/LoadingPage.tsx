import { useEffect, useState } from "react";
import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import { fetchNextStep } from "../features/story/api";
import { buildHistory } from "../features/story/session";
import type { StorySession, StoryNextResponse } from "../features/story/types";
import type { NavigateFn } from "../app/routes";

type Props = {
  session: StorySession | null;
  mode: "start" | "continue" | "finish";
  onStepFetched: (response: StoryNextResponse) => void;
  navigate: NavigateFn;
};

const LOADING_MESSAGES = [
  "おはなしを つくってるよ…",
  "どんな おはなしに なるかな…",
  "もうすこし まってね…",
];

const FINISH_LOADING_MESSAGES = [
  "おはなしを しめくくっているよ…",
  "もうすこしで おしまいだよ…",
];

// React StrictMode (dev) の二重 mount で同一リクエストが直後に再送されるのを防ぐ。
let lastDispatchedRequestKey: string | null = null;

export function LoadingPage({ session, mode, onStepFetched, navigate }: Props) {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = mode === "finish" ? FINISH_LOADING_MESSAGES : LOADING_MESSAGES;

  // 文言を 2.5 秒ごとに切り替え
  useEffect(() => {
    const id = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 2500);
    return () => window.clearInterval(id);
  }, [messages.length]);

  useEffect(() => {
    setMessageIndex(0);
  }, [mode]);

  useEffect(() => {
    if (!session) return;
    const history = buildHistory(session);
    const requestKey = JSON.stringify({
      mode,
      theme: session.theme,
      keywords: session.keywords,
      history,
      retryCount,
    });

    if (requestKey === lastDispatchedRequestKey) return;
    lastDispatchedRequestKey = requestKey;

    fetchNextStep({
      mode,
      theme: session.theme,
      keywords: session.keywords,
      history,
    })
      .then(onStepFetched)
      .catch((err: unknown) => {
        console.error("fetchNextStep failed:", err);
        setHasError(true);
      });
  }, [session, mode, onStepFetched, retryCount]);

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
      <h2 className="loading-text">{messages[messageIndex]}</h2>
    </Screen>
  );
}
