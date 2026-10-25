export type ScreenName = "home" | "onboarding" | "setup" | "loading" | "story" | "ending";

export type NavigateFn = (screen: ScreenName) => void;
