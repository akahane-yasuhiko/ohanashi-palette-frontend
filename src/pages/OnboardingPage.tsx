import { useCallback, useEffect, useState } from "react";
import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import { LoadingMessage } from "../components/layout/LoadingMessage";
import { KanjiGradeSelect } from "../components/theme/KanjiGradeSelect";
import { fetchThemeQuestions } from "../features/theme/api";
import { FALLBACK_QUESTIONS, FIXED_QUESTIONS } from "../features/theme/questions";
import { loadPreferences, savePreferences } from "../features/theme/preferences";
import type { OnboardingAnswer, OnboardingQuestion, QuestionChoice } from "../features/theme/types";

type Props = {
  onComplete: (answers: OnboardingAnswer[]) => void;
};

/**
 * - choose: 保存済みの答えがあるとき「まえと おなじ こたえで」/「こたえなおす」を選ぶ
 * - fixed: 固定2問
 * - loading: 後半2問を生成中
 * - generated: 生成2問
 */
type Phase = "choose" | "fixed" | "loading" | "generated";

const QUESTION_LOADING_MESSAGES = [
  "つぎの しつもんを かんがえてるよ…",
  "もうすこし まってね…",
];

export function OnboardingPage({ onComplete }: Props) {
  const [savedAnswers] = useState(() => loadPreferences().answers);
  const [grade, setGrade] = useState(() => loadPreferences().kanjiGrade);
  const [phase, setPhase] = useState<Phase>(savedAnswers ? "choose" : "fixed");
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<OnboardingQuestion[]>([]);

  const handleGradeChange = useCallback((g: number) => {
    setGrade(g);
    savePreferences({ kanjiGrade: g });
  }, []);

  const finish = useCallback(
    (all: OnboardingAnswer[]) => {
      savePreferences({ answers: all });
      onComplete(all);
    },
    [onComplete],
  );

  // 固定2問に答えたら後半2問を生成する。失敗したら予備の固定質問を使う
  useEffect(() => {
    if (phase !== "loading") return;
    let cancelled = false;
    fetchThemeQuestions({ answers, kanjiGrade: grade })
      .catch((err: unknown) => {
        console.error("fetchThemeQuestions failed:", err);
        return FALLBACK_QUESTIONS;
      })
      .then((questions) => {
        if (cancelled) return;
        setGeneratedQuestions(questions);
        setPhase("generated");
      });
    return () => {
      cancelled = true;
    };
  }, [phase, answers, grade]);

  const handleAnswer = useCallback(
    (question: OnboardingQuestion, choice: QuestionChoice) => {
      const next = [
        ...answers,
        { questionId: question.id, choiceId: choice.id, label: choice.label, textStyle: choice.textStyle },
      ];
      setAnswers(next);
      if (next.length === FIXED_QUESTIONS.length) {
        setPhase("loading");
      } else if (next.length === FIXED_QUESTIONS.length + generatedQuestions.length) {
        finish(next);
      }
    },
    [answers, generatedQuestions.length, finish],
  );

  if (phase === "loading") {
    return (
      <Screen>
        <LoadingMessage messages={QUESTION_LOADING_MESSAGES} />
      </Screen>
    );
  }

  const gradeSelect = <KanjiGradeSelect grade={grade} onChange={handleGradeChange} />;

  if (phase === "choose" && savedAnswers) {
    return (
      <Screen>
        {gradeSelect}
        <h2>すきなものを えらぼう</h2>
        <p>まえの こたえ: {savedAnswers.map((a) => a.label).join("、")}</p>
        <div className="button-row">
          <PrimaryButton onClick={() => finish(savedAnswers)}>まえと おなじ こたえで</PrimaryButton>
          <PrimaryButton onClick={() => setPhase("fixed")}>こたえなおす</PrimaryButton>
        </div>
      </Screen>
    );
  }

  const question =
    phase === "fixed"
      ? FIXED_QUESTIONS[answers.length]
      : generatedQuestions[answers.length - FIXED_QUESTIONS.length];
  if (!question) return null;

  const total = FIXED_QUESTIONS.length + 2;

  return (
    <Screen>
      {gradeSelect}
      <p>
        {answers.length + 1} / {total}
      </p>
      <p className="question-text">{question.text}</p>
      <div className="card-grid">
        {question.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className="selectable-card"
            onClick={() => handleAnswer(question, choice)}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </Screen>
  );
}
