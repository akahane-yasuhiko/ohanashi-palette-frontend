import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import type { NavigateFn } from "../app/routes";

type Props = {
  navigate: NavigateFn;
};

export function StoryPage({ navigate }: Props) {
  return (
    <Screen>
      <p className="story-text">
        あるひ、あかいでんしゃが もりのなかを はしっていました。
      </p>
      <PrimaryButton onClick={() => navigate("loading")}>つぎへ</PrimaryButton>
    </Screen>
  );
}
