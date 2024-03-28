import {
  BotInfo,
  BrowserInfo,
  NodeInfo,
  ReactNativeInfo,
  SearchBotDeviceInfo,
  detect,
} from "detect-browser";

function detectEnv(
  userAgent?: string,
):
  | BrowserInfo
  | BotInfo
  | NodeInfo
  | SearchBotDeviceInfo
  | ReactNativeInfo
  | null {
  return detect(userAgent);
}

/**
 * @internal
 */
export function isAndroid(): boolean {
  const os = detectOS();
  return os ? os.toLowerCase().includes("android") : false;
}

/**
 * @internal
 */
export function isIOS(): boolean {
  const os = detectOS();
  return os
    ? os.toLowerCase().includes("ios") ||
        (os.toLowerCase().includes("mac") && navigator.maxTouchPoints > 1)
    : false;
}

/**
 * @internal
 */
export function detectOS() {
  const env = detectEnv();
  return env?.os ? env.os : undefined;
}

/**
 * @internal
 */
export function isMobile(): boolean {
  const os = detectOS();
  return os ? isAndroid() || isIOS() : false;
}
