/** テーマ識別子 */
export type Theme = "でんしゃ" | "うみ";

/** API レスポンス内の選択肢 */
export type StoryChoice = {
  id: string;
  label: string;
};

/** 1ステップの記録（フロント保持用） */
export type StoryStep = {
  stepIndex: number;
  text: string;
  choices: StoryChoice[];
  isEnd: boolean;
  selectedChoiceId: string | null;
  selectedChoiceLabel: string | null;
};

/** セッション状態 */
export type SessionStatus = "playing" | "ended";

/** 進行中セッション全体 */
export type StorySession = {
  theme: Theme;
  keywords: string[];
  steps: StoryStep[];
  status: SessionStatus;
};

/** API リクエスト用の history 要素 */
export type HistoryEntry = {
  stepIndex: number;
  text: string;
  selectedChoiceId: string | null;
  selectedChoiceLabel: string | null;
};

/** POST /api/story/next リクエスト */
export type StoryNextRequest = {
  mode: "start" | "continue";
  theme: Theme;
  keywords: string[];
  history: HistoryEntry[];
};

/** POST /api/story/next レスポンス */
export type StoryNextResponse = {
  stepIndex: number;
  text: string;
  choices: StoryChoice[];
  isEnd: boolean;
};
