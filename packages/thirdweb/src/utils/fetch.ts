import type { ThirdwebClient } from "../client/client.js";
import { version } from "../version.js";
import type { Ecosystem } from "../wallets/in-app/web/types.js";
import { LruMap } from "./caching/lru.js";
import {
  type OperatingSystem,
  detectOS,
  detectPlatform,
} from "./detect-platform.js";

const DEFAULT_REQUEST_TIMEOUT = 60000;

const FETCH_CACHE = new WeakMap<
  { client: ThirdwebClient; ecosystem?: Ecosystem },
  (url: string, init?: RequestInit) => Promise<Response>
>();

/**
 * @internal
 */
export function getClientFetch(client: ThirdwebClient, ecosystem?: Ecosystem) {
  if (FETCH_CACHE.has({ client, ecosystem })) {
    // biome-ignore lint/style/noNonNullAssertion: the `has` above ensures that this will always be set
    return FETCH_CACHE.get({ client, ecosystem })!;
  }

  /**
   * @internal
   */
  async function fetchWithHeaders(
    url: string,
    init?: Omit<RequestInit, "signal"> & { requestTimeoutMs?: number },
  ): Promise<Response> {
    const { requestTimeoutMs = DEFAULT_REQUEST_TIMEOUT, ...restInit } =
      init || {};

    let headers = restInit.headers ? new Headers(restInit.headers) : undefined;

    // check if we are making a request to a thirdweb service (we don't want to send any headers to non-thirdweb services)
    if (isThirdwebUrl(url)) {
      if (!headers) {
        headers = new Headers();
      }
      const authToken = getTWAuthToken();
      // if we have an auth token set, use that (thirdweb.com/dashboard sets this for the user)
      if (authToken) {
        headers.set("authorization", `Bearer ${authToken}`);
      } else if (client.secretKey) {
        headers.set("x-secret-key", client.secretKey);
      } else if (client.clientId) {
        headers.set("x-client-id", client.clientId);
      }

      if (ecosystem) {
        headers.set("x-ecosystem-id", ecosystem.id);
        if (ecosystem.partnerId) {
          headers.set("x-ecosystem-partner-id", ecosystem.partnerId);
        }
      }
      // this already internally caches
      for (const [key, value] of getPlatformHeaders()) {
        (headers as Headers).set(key, value);
      }
    }

    let controller: AbortController | undefined;
    let abortTimeout: ReturnType<typeof setTimeout> | undefined;
    if (requestTimeoutMs) {
      controller = new AbortController();
      abortTimeout = setTimeout(() => {
        controller?.abort();
      }, requestTimeoutMs);
    }

    return fetch(url, {
      ...restInit,
      headers,
      signal: controller?.signal,
    }).finally(() => {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    });
  }
  FETCH_CACHE.set({ client, ecosystem }, fetchWithHeaders);
  return fetchWithHeaders;
}

// NOTE: these all start with "." because we want to make sure we don't match (for example) "otherthirdweb.com"
const THIRDWEB_DOMAINS = [
  ".thirdweb.com",
  ".ipfscdn.io",
  // dev domains
  ".thirdweb.dev",
  ".thirdweb-dev.com",
] as const;

const IS_THIRDWEB_URL_CACHE = new LruMap<boolean>(4096);

/**
 * @internal
 */
export function isThirdwebUrl(url: string): boolean {
  if (IS_THIRDWEB_URL_CACHE.has(url)) {
    // biome-ignore lint/style/noNonNullAssertion: the `has` above ensures that this will always be set
    return IS_THIRDWEB_URL_CACHE.get(url)!;
  }
  try {
    const { hostname } = new URL(url);

    try {
      // special case for localhost in development only
      if (process.env.NODE_ENV === "development") {
        if (hostname === "localhost") {
          IS_THIRDWEB_URL_CACHE.set(url, true);
          return true;
        }
      }
    } catch {}

    const is = THIRDWEB_DOMAINS.some((domain) => hostname.endsWith(domain));
    IS_THIRDWEB_URL_CACHE.set(url, is);
    return is;
  } catch {
    IS_THIRDWEB_URL_CACHE.set(url, false);
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

  let bundleId: string | undefined = undefined;
  if (typeof globalThis !== "undefined" && "Application" in globalThis) {
    // shims use wallet connect RN module which injects Application info in globalThis
    // biome-ignore lint/suspicious/noExplicitAny: get around globalThis typing
    bundleId = (globalThis as any).Application.applicationId;
  }

  previousPlatform = Object.entries({
    "x-sdk-platform": detectPlatform(),
    "x-sdk-version": version,
    "x-sdk-os": os ? parseOs(os) : "unknown",
    "x-sdk-name": SDK_NAME,
    ...(bundleId ? { "x-bundle-id": bundleId } : {}),
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

function getTWAuthToken(): string | null {
  if (
    typeof globalThis !== "undefined" &&
    "TW_AUTH_TOKEN" in globalThis &&
    // biome-ignore lint/suspicious/noExplicitAny: get around globalThis typing
    typeof (globalThis as any).TW_AUTH_TOKEN === "string"
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: get around globalThis typing
    return (globalThis as any).TW_AUTH_TOKEN as string;
  }
  return null;
}
