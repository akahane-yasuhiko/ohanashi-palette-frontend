import { useState } from "react";
import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import { peekSession } from "../features/story/storage";
import type { NavigateFn } from "../app/routes";

type Props = {
  navigate: NavigateFn;
  onResume: () => void;
};

export function HomePage({ navigate, onResume }: Props) {
  const [canResume] = useState(() => {
    const saved = peekSession();
    return saved !== null && saved.status === "playing";
  });

  return (
    <Screen>
      <h1>おはなしパレット</h1>
      <p>すきな おはなしを つくってみよう</p>
      <PrimaryButton onClick={() => navigate("setup")}>はじめる</PrimaryButton>
      {canResume && (
        <PrimaryButton onClick={onResume}>つづきから</PrimaryButton>
      )}
    </Screen>
  );
}
