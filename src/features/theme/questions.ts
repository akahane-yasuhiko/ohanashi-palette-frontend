import type { OnboardingQuestion } from "./types";

/**
 * オンボーディングの固定2問（PROJECT.md の Onboarding Questions 正本準拠）。
 * 漢字の選択肢は小学1年生の漢字だけで書く。
 */
export const FIXED_QUESTIONS: OnboardingQuestion[] = [
  {
    id: "fixed_1",
    text: "どんな ところに いきたい？",
    choices: [
      { id: "fixed_1_c1", label: "うみの そこ", textStyle: "hiragana" },
      { id: "fixed_1_c2", label: "おかしの くに", textStyle: "hiragana" },
      { id: "fixed_1_c3", label: "森の 中", textStyle: "kanji" },
      { id: "fixed_1_c4", label: "空の 上", textStyle: "kanji" },
    ],
  },
  {
    id: "fixed_2",
    text: "だれと いっしょが いい？",
    choices: [
      { id: "fixed_2_c1", label: "どうぶつ", textStyle: "hiragana" },
      { id: "fixed_2_c2", label: "ロボット", textStyle: "hiragana" },
      { id: "fixed_2_c3", label: "王女さま", textStyle: "kanji" },
      { id: "fixed_2_c4", label: "小人", textStyle: "kanji" },
    ],
  },
];

/** 質問生成に失敗したときの予備の固定質問（バックエンドの予備と同じ内容） */
export const FALLBACK_QUESTIONS: OnboardingQuestion[] = [
  {
    id: "gen_1",
    text: "どんな ことを してみたい？",
    choices: [
      { id: "gen_1_c1", label: "たんけん", textStyle: "hiragana" },
      { id: "gen_1_c2", label: "パーティー", textStyle: "hiragana" },
      { id: "gen_1_c3", label: "空を とぶ", textStyle: "kanji" },
      { id: "gen_1_c4", label: "たからを 見つける", textStyle: "kanji" },
    ],
  },
  {
    id: "gen_2",
    text: "どれが すき？",
    choices: [
      { id: "gen_2_c1", label: "まほう", textStyle: "hiragana" },
      { id: "gen_2_c2", label: "きらきら ほし", textStyle: "hiragana" },
      { id: "gen_2_c3", label: "大きな 車", textStyle: "kanji" },
      { id: "gen_2_c4", label: "赤い 花", textStyle: "kanji" },
    ],
  },
];
