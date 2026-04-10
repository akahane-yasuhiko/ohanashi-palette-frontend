import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import type { NavigateFn } from "../app/routes";

type Props = {
  navigate: NavigateFn;
};

export function HomePage({ navigate }: Props) {
  return (
    <Screen>
      <h1>おはなしパレット</h1>
      <p>すきな おはなしを つくってみよう</p>
      <PrimaryButton onClick={() => navigate("setup")}>はじめる</PrimaryButton>
    </Screen>
  );
}
