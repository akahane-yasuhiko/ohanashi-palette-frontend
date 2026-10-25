export type ScreenName = "home" | "onboarding" | "themeSuggest" | "setup" | "loading" | "story" | "ending";

export type NavigateFn = (screen: ScreenName) => void;
