import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import type { NavigateFn } from "../app/routes";

type Props = {
  navigate: NavigateFn;
};

export function EndingPage({ navigate }: Props) {
  return (
    <Screen>
      <h2>おしまい</h2>
      <div className="button-row">
        <PrimaryButton onClick={() => navigate("setup")}>
          もういちど
        </PrimaryButton>
        <PrimaryButton onClick={() => navigate("home")}>ホームへ</PrimaryButton>
      </div>
    </Screen>
  );
}
