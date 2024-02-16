import { detectOS } from "./detect-browser";

export function getOperatingSystem() {
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    return "";
  } else if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent;

    return detectOS(userAgent) || "";
  } else {
    return process.platform;
  }
}
