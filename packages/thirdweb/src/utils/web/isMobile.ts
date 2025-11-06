import { detectOS } from "../detect-platform.js";

/**
 * @internal
 */
function isAndroid(): boolean {
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
function isIOS(): boolean {
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
function hasTouchScreen(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE specific
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * @internal
 */
function hasMobileAPIs(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return "orientation" in window || "onorientationchange" in window;
}

/**
 * @internal
 */
export function isMobile(): boolean {
  // Primary signal: OS detection via user agent
  const isMobileOS = isAndroid() || isIOS();

  if (isMobileOS) {
    return true;
  }

  // Secondary signal: catch edge cases like webviews with modified user agents
  // Both touch capability AND mobile-specific APIs must be present to avoid
  // false positives on touch-enabled desktops
  if (hasTouchScreen() && hasMobileAPIs()) {
    return true;
  }

  return false;
}
