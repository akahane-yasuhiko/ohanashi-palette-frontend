import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import type { NavigateFn } from "../app/routes";

type Props = {
  navigate: NavigateFn;
  onPlayAgain: () => void;
};

export function EndingPage({ navigate, onPlayAgain }: Props) {
  return (
    <Screen>
      <h2>おしまい</h2>
      <div className="button-row">
        <PrimaryButton onClick={onPlayAgain}>
          もういちど
        </PrimaryButton>
        <PrimaryButton onClick={() => navigate("home")}>ホームへ</PrimaryButton>
      </div>
    </Screen>
  );
}
