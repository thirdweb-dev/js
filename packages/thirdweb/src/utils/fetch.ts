import type { ThirdwebClient } from "../client/client.js";
import { version } from "../version.js";
import type { Ecosystem } from "../wallets/in-app/core/wallet/types.js";
import { LruMap } from "./caching/lru.js";
import {
  detectOS,
  detectPlatform,
  type OperatingSystem,
} from "./detect-platform.js";
import { getServiceKey } from "./domains.js";
import { isJWT } from "./jwt/is-jwt.js";
import { IS_DEV } from "./process.js";

const DEFAULT_REQUEST_TIMEOUT = 60000;

/**
 * @internal
 */
export function getClientFetch(client: ThirdwebClient, ecosystem?: Ecosystem) {
  /**
   * @internal
   */
  async function fetchWithHeaders(
    url: string | Request,
    init?: Omit<RequestInit, "signal"> & {
      requestTimeoutMs?: number;
      useAuthToken?: boolean;
    },
  ): Promise<Response> {
    const {
      requestTimeoutMs = DEFAULT_REQUEST_TIMEOUT,
      useAuthToken,
      ...restInit
    } = init || {};

    let headers = restInit.headers
      ? new Headers(restInit.headers)
      : typeof url === "object"
        ? url.headers
        : undefined;
    const urlString = typeof url === "string" ? url : url.url;

    // check if we are making a request to a thirdweb service (we don't want to send any headers to non-thirdweb services)
    if (isThirdwebUrl(urlString)) {
      if (!headers) {
        headers = new Headers();
      }
      // auth token if secret key === jwt
      const authToken =
        useAuthToken && client.secretKey && isJWT(client.secretKey)
          ? client.secretKey
          : undefined;
      // secret key if secret key !== jwt
      const secretKey =
        client.secretKey && !isJWT(client.secretKey)
          ? client.secretKey
          : undefined;
      const clientId = client.clientId;

      if (authToken && isBundlerUrl(urlString)) {
        headers.set("authorization", `Bearer ${authToken}`);
        if (client.teamId) {
          headers.set("x-team-id", client.teamId);
        }

        if (clientId) {
          headers.set("x-client-id", clientId);
        }
      }
      // if we have an auth token set, use that (thirdweb dashboard sets this for the user)
      // pay urls should never send the auth token, because we always want the "developer" to be the one making the request, not the "end user"
      else if (
        authToken &&
        !isPayUrl(urlString) &&
        !isInAppWalletUrl(urlString)
      ) {
        headers.set("authorization", `Bearer ${authToken}`);
        // if we have a specific teamId set, add it to the request headers
        if (client.teamId) {
          headers.set("x-team-id", client.teamId);
        }
      } else {
        // only set secret key or client id if we are NOT using the auth token!
        if (secretKey) {
          headers.set("x-secret-key", secretKey);
        }

        if (clientId) {
          headers.set("x-client-id", clientId);
        }
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

      const serviceKey = getServiceKey();
      if (serviceKey) {
        headers.set("x-service-api-key", serviceKey);
      }
    }

    let controller: AbortController | undefined;
    let abortTimeout: ReturnType<typeof setTimeout> | undefined;
    if (requestTimeoutMs) {
      controller = new AbortController();
      abortTimeout = setTimeout(() => {
        controller?.abort("timeout");
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
  return fetchWithHeaders;
}

// NOTE: these all start with "." because we want to make sure we don't match (for example) "otherthirdweb.com"
const THIRDWEB_DOMAINS = [
  ".thirdweb.com",
  ".ipfscdn.io",
  // dev domains
  ".thirdweb.dev",
  ".thirdweb-dev.com",
  ".thirdwebstorage-dev.com",
] as const;

export const IS_THIRDWEB_URL_CACHE = new LruMap<boolean>(4096);

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
      if (IS_DEV) {
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

function isPayUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    // pay service hostname always starts with "pay."
    return hostname.startsWith("pay.");
  } catch {
    return false;
  }
}

function isInAppWalletUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    // in app wallet service hostname always starts with "in-app-wallet." or "embedded-wallet."
    return (
      hostname.startsWith("in-app-wallet.") ||
      hostname.startsWith("embedded-wallet.")
    );
  } catch {
    return false;
  }
}

function isBundlerUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname.endsWith(".bundler.thirdweb.com") ||
      hostname.endsWith(".bundler.thirdweb-dev.com")
    );
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

  let bundleId: string | undefined;
  if (typeof globalThis !== "undefined" && "Application" in globalThis) {
    // shims use wallet connect RN module which injects Application info in globalThis
    // biome-ignore lint/suspicious/noExplicitAny: get around globalThis typing
    bundleId = (globalThis as any).Application.applicationId;
  }

  previousPlatform = Object.entries({
    "x-sdk-name": SDK_NAME,
    "x-sdk-os": os ? parseOs(os) : "unknown",
    "x-sdk-platform": detectPlatform(),
    "x-sdk-version": version,
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
