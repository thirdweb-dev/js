import { detectOS } from "../detect-platform.js";

/**
 * @internal
 */
export function isAndroid(): boolean {
  // can only detect if useragent is defined
  if (typeof navigator === "undefined") {
    return false;
  }
  const os = detectOS(navigator.userAgent);
  return os ? os.toLowerCase().includes("android") : false;
}

/**
 * @internal
 */
export function isIOS(): boolean {
  // can only detect if useragent is defined
  if (typeof navigator === "undefined") {
    return false;
  }
  const os = detectOS(navigator.userAgent);
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
