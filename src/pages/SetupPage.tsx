import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import type { NavigateFn } from "../app/routes";

type Props = {
  navigate: NavigateFn;
};

export function SetupPage({ navigate }: Props) {
  return (
    <Screen>
      <h2>テーマと ことばを えらぼう</h2>
      <p>（テーマ・ことば選択は次のタスクで実装）</p>
      <PrimaryButton onClick={() => navigate("loading")}>
        おはなしを つくる
      </PrimaryButton>
    </Screen>
  );
}
