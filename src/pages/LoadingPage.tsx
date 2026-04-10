import { useEffect } from "react";
import { Screen } from "../components/layout/Screen";
import type { NavigateFn, ScreenName } from "../app/routes";

type Props = {
  destination: ScreenName;
  navigate: NavigateFn;
};

export function LoadingPage({ destination, navigate }: Props) {
  useEffect(() => {
    const id = window.setTimeout(() => {
      navigate(destination);
    }, 800);
    return () => window.clearTimeout(id);
  }, [destination, navigate]);

  return (
    <Screen>
      <h2>おはなしを つくってるよ…</h2>
    </Screen>
  );
}
