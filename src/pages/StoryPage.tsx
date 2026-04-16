import { useEffect } from "react";
import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import { speakText, stopSpeech } from "../utils/speech";
import type { StorySession } from "../features/story/types";

type Props = {
  session: StorySession | null;
  onChoice: (choiceId: string, choiceLabel: string) => void;
  onNext: () => void;
  onFinish: () => void;
  onGoEnding: () => void;
};

/** この step 以降は「おしまい」ボタンを表示する */
const END_BUTTON_MIN_STEP = 5;
/** この step 以降は通常進行を隠して「おしまい」のみにする */
const FINISH_ONLY_MIN_STEP = 10;

export function StoryPage({ session, onChoice, onNext, onFinish, onGoEnding }: Props) {
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

  const text = currentStep.text;
  const stepIndex = currentStep.stepIndex;
  const isEndStep = currentStep.isEnd;
  const showEndButton = !isEndStep && stepIndex >= END_BUTTON_MIN_STEP;
  const finishOnly = !isEndStep && stepIndex >= FINISH_ONLY_MIN_STEP;

  return (
    <Screen>
      <p className="story-text">{text}</p>

      <button
        type="button"
        className="speak-button"
        onClick={() => speakText(text)}
        aria-label="よみあげる"
      >
        よみあげる
      </button>

      {isEndStep ? (
        // 締め文ステップ: Ending へ進むボタンだけ
        <PrimaryButton onClick={onGoEnding}>おわりへ</PrimaryButton>
      ) : finishOnly ? (
        // 10ステップ以降: おしまいのみ
        <PrimaryButton onClick={onFinish}>おしまい</PrimaryButton>
      ) : (
        <>
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

          {showEndButton && (
            <button
              type="button"
              className="end-button"
              onClick={onFinish}
            >
              おしまい
            </button>
          )}
        </>
      )}
    </Screen>
  );
}
