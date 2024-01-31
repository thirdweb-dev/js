export const reservedScreens = {
  main: "main",
  getStarted: "getStarted",
  signIn: "signIn",
};

export const modalMaxWidthCompact = "360px";
export const modalMaxWidthWide = "730px";

export const wideModalMaxHeight = "570px";
export const compactModalMaxHeight = "600px";

export const defaultTheme = "dark";

export const modalCloseFadeOutDuration = 250;

/**
 * @internal
 */
export function onModalUnmount(cb: () => void) {
  setTimeout(cb, modalCloseFadeOutDuration + 100);
}
