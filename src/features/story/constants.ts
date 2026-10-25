import type { TextStyle, Theme } from "./types";

/** localStorage に保存するキー */
export const STORAGE_KEY = "ohanashi-palette.current-session";

/** ことば選択の下限・上限 */
export const MIN_KEYWORDS = 2;
export const MAX_KEYWORDS = 3;

/** テーマごとの表示名・文体・キーワード候補（PROJECT.md 正本準拠） */
export type ThemeEntry = {
  id: Theme;
  label: string;
  textStyle: TextStyle;
  keywords: string[];
};

/** 固定テーマ。漢字のテーマは小学1年生の漢字だけで書いている */
export const THEME_CATALOG: ThemeEntry[] = [
  {
    id: "でんしゃ",
    label: "でんしゃ",
    textStyle: "hiragana",
    keywords: ["あか", "もり", "くま", "えき", "トンネル", "にじ", "ほしぞら", "おべんとう"],
  },
  {
    id: "うみ",
    label: "うみ",
    textStyle: "hiragana",
    keywords: ["にんぎょ", "ほうせき", "かいがら", "くじら", "しま", "さんご", "たからばこ", "ひかり"],
  },
  {
    id: "学校",
    label: "学校",
    textStyle: "kanji",
    keywords: ["先生", "ともだち", "休み じかん", "赤い ボール", "火よう日", "早おき"],
  },
  {
    id: "森の 王さま",
    label: "森の 王さま",
    textStyle: "kanji",
    keywords: ["大きな 木", "小さな 虫", "青い 花", "川", "金の かんむり", "白い 石"],
  },
  {
    id: "花火",
    label: "花火",
    textStyle: "kanji",
    keywords: ["なつまつり", "よぞら", "月", "大きな 音", "赤い 花火", "ゆかた"],
  },
];
