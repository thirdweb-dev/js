import { version } from "../version.js";
import type { ThirdwebClient } from "../index.js";
import { detect, type OperatingSystem } from "detect-browser";

/**
 *
 * @param input -
 * @param init -
 * @internal
 */
export function getFetchClient(client: ThirdwebClient) {
  return async function (url: string, init?: RequestInit) {
    const headers = new Headers(init?.headers);
    if (client.secretKey) {
      headers.set("x-secret-key", client.secretKey);
    } else if (client.clientId) {
      headers.set("x-client-id", client.clientId);
    }

    getPlatform().forEach(([key, value]) => {
      headers.set(key, value);
    });
    return fetch(url, { ...init, headers });
  };
}

const SDK_NAME = "unified-sdk";

let previousPlatform: [string, string][] | undefined;
/**
 * @internal
 */
function getPlatform() {
  if (previousPlatform) {
    return previousPlatform;
  }

  let ua: string | undefined;
  try {
    if (typeof navigator !== "undefined" && "userAgent" in navigator) {
      ua = navigator.userAgent;
    }
  } catch {
    // ignore
  }

  const info = detect(ua);

  if (!info) {
    previousPlatform = Object.entries({
      "x-sdk-platform": "unknown",
      "x-sdk-version": version,
      "x-sdk-os": "unknown",
      "x-sdk-name": SDK_NAME,
    });
  } else {
    previousPlatform = Object.entries({
      "x-sdk-platform":
        info.type === "react-native"
          ? "mobile"
          : info.type === "browser"
            ? "browser"
            : "node",
      "x-sdk-version": version,
      "x-sdk-os": info.os ? parseOs(info.os) : "unknown",
      "x-sdk-name": SDK_NAME,
    });
  }

  return previousPlatform;
}

/**
 * @internal
 */
function parseOs(os: OperatingSystem | NodeJS.Platform) {
  const lowerCase = os.toLowerCase();
  if (lowerCase.startsWith("win")) {
    return "win";
  }
  switch (os) {
    case "Mac OS":
      return "mac";
    case "iOS":
      return "ios";
    case "Android OS":
      return "android";
    default:
      return lowerCase.replace(/\s/gi, "_");
  }
}
