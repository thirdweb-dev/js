import { detect } from "../../utils/detect-browser.js";

/**
 * @internal
 */
function isAndroid(): boolean {
  const os = detect()?.os;
  return os ? os.toLowerCase().includes("android") : false;
}

/**
 * @internal
 */
function isIOS(): boolean {
  const os = detect()?.os;
  return os
    ? os.toLowerCase().includes("ios") ||
        (os.toLowerCase().includes("mac") && navigator.maxTouchPoints > 1)
    : false;
}

/**
 * @internal
 */
export function isMobile(): boolean {
  return isAndroid() || isIOS();
}
