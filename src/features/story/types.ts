/** テーマ名（固定テーマの名前、または生成されたテーマの label） */
export type Theme = string;

/** 本文の文体 */
export type TextStyle = "hiragana" | "kanji";

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
  textStyle: TextStyle;
  /** textStyle="kanji" のとき 1〜6（小学○年生までの漢字）、"hiragana" のとき null */
  kanjiGrade: number | null;
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
  mode: "start" | "continue" | "finish";
  theme: Theme;
  keywords: string[];
  textStyle: TextStyle;
  kanjiGrade: number | null;
  history: HistoryEntry[];
};

/** POST /api/story/next レスポンス */
export type StoryNextResponse = {
  stepIndex: number;
  text: string;
  choices: StoryChoice[];
  isEnd: boolean;
};
