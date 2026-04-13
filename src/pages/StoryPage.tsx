import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import type { StorySession } from "../features/story/types";

type Props = {
  session: StorySession | null;
  onChoice: (choiceId: string, choiceLabel: string) => void;
  onNext: () => void;
};

export function StoryPage({ session, onChoice, onNext }: Props) {
  const currentStep = session?.steps[session.steps.length - 1];

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
