import type { TextStyle } from "../story/types";

export type QuestionChoice = {
  id: string;
  label: string;
  textStyle: TextStyle;
};

export type OnboardingQuestion = {
  id: string;
  text: string;
  choices: QuestionChoice[];
};

export type OnboardingAnswer = {
  questionId: string;
  choiceId: string;
  label: string;
  textStyle: TextStyle;
};

/** POST /api/theme/questions リクエスト */
export type ThemeQuestionsRequest = {
  answers: OnboardingAnswer[];
  kanjiGrade: number;
};

/** POST /api/theme/questions レスポンス */
export type ThemeQuestionsResponse = {
  questions: OnboardingQuestion[];
};

/** 生成されたテーマ候補 */
export type SuggestedTheme = {
  id: string;
  label: string;
  textStyle: TextStyle;
  kanjiGrade: number | null;
  keywords: string[];
};

/** POST /api/theme/suggest リクエスト */
export type ThemeSuggestRequest = {
  answers: OnboardingAnswer[];
  kanjiGrade: number;
  excludeThemes: string[];
};

/** POST /api/theme/suggest レスポンス */
export type ThemeSuggestResponse = {
  themes: SuggestedTheme[];
};
