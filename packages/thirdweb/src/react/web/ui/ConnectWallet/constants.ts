export const reservedScreens = {
  getStarted: "getStarted",
  main: "main",
  showAll: "showAll",
  signIn: "signIn",
};

export const modalMaxWidthCompact = "400px";

const wideModalWidth = 730;
export const modalMaxWidthWide = `${wideModalWidth}px`;
export const wideModalScreenThreshold = wideModalWidth + 40;

export const wideModalMaxHeight = "570px";
export const compactModalMaxHeight = "660px";

export const modalCloseFadeOutDuration = 250;

/**
 * @internal
 */
export function onModalUnmount(cb: () => void) {
  setTimeout(cb, modalCloseFadeOutDuration + 100);
}
