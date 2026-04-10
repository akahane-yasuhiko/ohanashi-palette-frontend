export type ScreenName = "home" | "setup" | "loading" | "story" | "ending";

export type NavigateFn = (screen: ScreenName) => void;
