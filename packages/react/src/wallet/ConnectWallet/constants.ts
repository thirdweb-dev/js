export const reservedScreens = {
  main: "main",
  getStarted: "getStarted",
  signIn: "signIn",
};

export const modalMaxWidthCompact = "360px";
export const modalMaxWidthWide = "730px";

export const defaultModalTitle = "Connect";

export const widemodalMaxHeight = "550px";
export const compactmodalMaxHeight = "600px";

export const defaultTheme = "dark";

export const modalCloseFadeOutDuration = 250;

export function onModalUnmount(cb: () => void) {
  setTimeout(cb, modalCloseFadeOutDuration + 100);
}
