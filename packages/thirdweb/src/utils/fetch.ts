import type { ThirdwebClient } from "../client/client.js";
import { version } from "../version.js";
import {
  detectOS,
  detectPlatform,
  type OperatingSystem,
} from "./detect-browser.js";

const FETCH_CACHE = new WeakMap<
  ThirdwebClient,
  (url: string, init?: RequestInit) => Promise<Response>
>();

/**
 * @internal
 */
export function getClientFetch(client: ThirdwebClient) {
  if (FETCH_CACHE.has(client)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return FETCH_CACHE.get(client)!;
  }
  /**
   * @internal
   */
  async function fetchWithHeaders(
    url: string,
    init?: Omit<RequestInit, "signal"> & { requestTimeoutMs?: number },
  ): Promise<Response> {
    const { requestTimeoutMs, ...restInit } = init || {};

    const headers = new Headers(restInit?.headers);
    // check if we are making a request to a thirdweb service (we don't want to send any headers to non-thirdweb services)
    if (isThirdwebUrl(url)) {
      if (client.secretKey) {
        headers.set("x-secret-key", client.secretKey);
      } else if (client.clientId) {
        headers.set("x-client-id", client.clientId);
      }
      getPlatformHeaders().forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    const controller = new AbortController();
    let abortTimeout: ReturnType<typeof setTimeout> | undefined;
    if (requestTimeoutMs) {
      abortTimeout = setTimeout(() => controller.abort(), requestTimeoutMs);
    }

    return fetch(url, {
      ...restInit,
      headers,
      signal: controller?.signal,
    }).finally(() => {
      clearTimeout(abortTimeout);
    });
  }
  FETCH_CACHE.set(client, fetchWithHeaders);
  return fetchWithHeaders;
}

// NOTE: these all start with "." because we want to make sure we don't match (for example) "otherthirdweb.com"
const THIRDWEB_DOMAINS = [
  ".thirdweb.com",
  ".ipfscdn.io",
  // dev domains
  ".thirdweb.dev",
  ".thirdweb-dev.com",
  "pay-server-s25c.chainsaw-dev.zeet.app",
] as const;

/**
 * @internal
 */
function isThirdwebUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return THIRDWEB_DOMAINS.some((domain) => hostname.endsWith(domain));
  } catch {
    return false;
  }
}

const SDK_NAME = "unified-sdk";

let previousPlatform: [string, string][] | undefined;
/**
 * @internal
 */
export function getPlatformHeaders() {
  if (previousPlatform) {
    return previousPlatform;
  }

  let os: OperatingSystem | null = null;
  if (typeof navigator !== "undefined") {
    os = detectOS(navigator.userAgent);
  }

  previousPlatform = Object.entries({
    "x-sdk-platform": detectPlatform(),
    "x-sdk-version": version,
    "x-sdk-os": os ? parseOs(os) : "unknown",
    "x-sdk-name": SDK_NAME,
  });

  return previousPlatform;
}

/**
 * @internal
 */
function parseOs(os: OperatingSystem | NodeJS.Platform) {
  const osLowerCased = os.toLowerCase();
  if (osLowerCased.startsWith("win")) {
    return "win";
  }
  // we do NOT use the lowercase here
  switch (os) {
    case "Mac OS":
      return "mac";
    case "iOS":
      return "ios";
    case "Android OS":
      return "android";
    default:
      // if we somehow fall through here, just replace all spaces with underscores and send it
      return osLowerCased.replace(/\s/gi, "_");
  }
}
