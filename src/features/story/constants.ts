import type { Theme } from "./types";

/** localStorage に保存するキー */
export const STORAGE_KEY = "ohanashi-palette.current-session";

/** ことば選択の下限・上限 */
export const MIN_KEYWORDS = 2;
export const MAX_KEYWORDS = 3;

/** テーマごとの表示名とキーワード候補（PROJECT.md 正本準拠） */
export type ThemeEntry = {
  id: Theme;
  label: string;
  keywords: string[];
};

export const THEME_CATALOG: ThemeEntry[] = [
  {
    id: "でんしゃ",
    label: "でんしゃ",
    keywords: ["あか", "もり", "くま", "えき", "トンネル", "にじ", "ほしぞら", "おべんとう"],
  },
  {
    id: "うみ",
    label: "うみ",
    keywords: ["にんぎょ", "ほうせき", "かいがら", "くじら", "しま", "さんご", "たからばこ", "ひかり"],
  },
];
