import { useEffect } from "react";
import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import { speakText, stopSpeech } from "../utils/speech";
import type { StorySession } from "../features/story/types";

type Props = {
  session: StorySession | null;
  onChoice: (choiceId: string, choiceLabel: string) => void;
  onNext: () => void;
};

export function StoryPage({ session, onChoice, onNext }: Props) {
  const currentStep = session?.steps[session.steps.length - 1];

  // 画面を離れる / ステップが変わったら読み上げ停止
  useEffect(() => {
    return () => stopSpeech();
  }, [currentStep?.stepIndex]);

  if (!currentStep) {
    return (
      <Screen>
        <p>おはなしを よみこんでいます…</p>
      </Screen>
    );
  }

  return (
    <Screen>
      <p className="story-text">{currentStep.text}</p>

      <button
        type="button"
        className="speak-button"
        onClick={() => speakText(currentStep.text)}
        aria-label="よみあげる"
      >
        よみあげる
      </button>

      {currentStep.choices.length === 2 ? (
        <div className="button-row">
          {currentStep.choices.map((choice) => (
            <PrimaryButton
              key={choice.id}
              onClick={() => onChoice(choice.id, choice.label)}
            >
              {choice.label}
            </PrimaryButton>
          ))}
        </div>
      ) : (
        <PrimaryButton onClick={onNext}>つぎへ</PrimaryButton>
      )}
    </Screen>
  );
}
