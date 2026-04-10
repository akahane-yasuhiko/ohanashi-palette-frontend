import type {
  Theme,
  StorySession,
  StoryStep,
  StoryNextResponse,
  HistoryEntry,
} from "./types";

/** 新しいセッションを生成する */
export function createSession(theme: Theme, keywords: string[]): StorySession {
  return {
    theme,
    keywords,
    steps: [],
    status: "playing",
  };
}

/** API レスポンスを StoryStep に変換して steps に追加する */
export function addStep(
  session: StorySession,
  response: StoryNextResponse,
): StorySession {
  const newStep: StoryStep = {
    stepIndex: response.stepIndex,
    text: response.text,
    choices: response.choices,
    isEnd: response.isEnd,
    selectedChoiceId: null,
    selectedChoiceLabel: null,
  };
  return {
    ...session,
    steps: [...session.steps, newStep],
  };
}

/** 最後のステップに選択結果を反映する */
export function selectChoice(
  session: StorySession,
  choiceId: string,
  choiceLabel: string,
): StorySession {
  if (session.steps.length === 0) return session;

  const steps = [...session.steps];
  const lastIndex = steps.length - 1;
  const lastStep = steps[lastIndex];
  if (!lastStep) return session;

  steps[lastIndex] = {
    ...lastStep,
    selectedChoiceId: choiceId,
    selectedChoiceLabel: choiceLabel,
  };
  return { ...session, steps };
}

/** 「つぎへ」（分岐なし）で進んだことを最後のステップに記録する */
export function markNextWithoutChoice(session: StorySession): StorySession {
  if (session.steps.length === 0) return session;

  const steps = [...session.steps];
  const lastIndex = steps.length - 1;
  const lastStep = steps[lastIndex];
  if (!lastStep) return session;

  steps[lastIndex] = {
    ...lastStep,
    selectedChoiceId: null,
    selectedChoiceLabel: null,
  };
  return { ...session, steps };
}

/** セッションを終了状態にする */
export function endSession(session: StorySession): StorySession {
  return { ...session, status: "ended" };
}

/** API リクエスト用の history 配列を組み立てる */
export function buildHistory(session: StorySession): HistoryEntry[] {
  return session.steps.map((step) => ({
    stepIndex: step.stepIndex,
    text: step.text,
    selectedChoiceId: step.selectedChoiceId,
    selectedChoiceLabel: step.selectedChoiceLabel,
  }));
}
