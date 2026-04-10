import { Screen } from "../components/layout/Screen";
import { PrimaryButton } from "../components/layout/PrimaryButton";
import type { NavigateFn } from "../app/routes";
import type { StorySession } from "../features/story/types";

type Props = {
  navigate: NavigateFn;
  session: StorySession | null;
};

export function StoryPage({ navigate, session }: Props) {
  const themeLabel = session?.theme ?? "???";
  const keywordList = session?.keywords.join("、") ?? "";

  return (
    <Screen>
      <p className="story-text">
        あるひ、あかいでんしゃが もりのなかを はしっていました。
      </p>
      <p>テーマ: {themeLabel} ／ ことば: {keywordList}</p>
      <PrimaryButton onClick={() => navigate("loading")}>つぎへ</PrimaryButton>
    </Screen>
  );
}
