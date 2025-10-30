//---
// Constants
//---
const TOKEN_DATA_KEY = "tw:nexus:td";
const STATE_KEY = "tw:nexus:state";
const VERIFIER_KEY = "tw:nexus:verifier";
const NEXUS_API_BASE_URL = "https://nexus-api.thirdweb-dev.com";
const OAUTH_CLIENT_ID = "9ad56e84-5abe-4ea5-a6c2-9834b9d31245";
// Token expiry buffer: consider token expired 5 minutes before actual expiry
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

//---
// Types
//---
type TokenData = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

type OAuthTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: "Bearer";
};

//---
// Token Encoding/Decoding
//---
function encodeTokenData(data: TokenData): string {
  return btoa(JSON.stringify(data));
}

function decodeTokenData(encoded: string): TokenData | null {
  try {
    const decoded = atob(encoded);
    return JSON.parse(decoded) as TokenData;
  } catch {
    return null;
  }
}

//---
// Initialization
// Automatically wrap global fetch and complete OAuth flow if returning from authorization
//---
(() => {
  if (hasWindow()) {
    completeOauthFlow();
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = wrap(originalFetch);
    } catch (error) {
      console.error("[thirdweb nexus] Error wrapping fetch", error);
      globalThis.fetch = originalFetch;
    }
  }
})();

//---
// Main Fetch Wrapper
//---
/**
 * Wraps a fetch function to automatically handle HTTP 402 (Payment Required) responses.
 * When a 402 is encountered, it uses the Nexus API to process the payment and retry the request.
 *
 * @param fetchFn - The fetch function to wrap (typically globalThis.fetch)
 * @param options - Optional configuration
 * @param options.maxValue - Maximum payment value allowed in wei
 * @returns A wrapped fetch function that handles 402 responses
 */
export function wrap(
  fetchFn: typeof globalThis.fetch,
  options?: {
    maxValue?: bigint;
  },
) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetchFn(input, init);

    if (response.status !== 402) {
      return response;
    }

    const AT = await getAuthToken();
    if (!AT) {
      // open login page in a new tab or throw an error if opening fails
      startOauthFlow();
      return new Response("Payment required", { status: 402 });
    }

    // create the proxy request
    const proxyUrl = new URL("/fetch", NEXUS_API_BASE_URL);
    proxyUrl.searchParams.set(
      "data",
      btoa(
        JSON.stringify({
          // original request related information
          request: {
            url: new URL(
              typeof input === "string"
                ? input
                : input instanceof Request
                  ? input.url
                  : input,
            ).toString(),
            method:
              (typeof input === "string"
                ? init?.method
                : input instanceof Request
                  ? input.method
                  : "GET") ?? "GET",
            headers:
              typeof input === "string"
                ? init?.headers
                : input instanceof Request
                  ? input.headers
                  : {},
          },
          // x402 options
          x402Options: {
            ...(options?.maxValue
              ? { maxValue: options.maxValue.toString() }
              : {}),
          },
        }),
      ),
    );

    let proxyRes = await fetchFn(proxyUrl, {
      method: "POST",
      body:
        (typeof input === "string"
          ? init?.body
          : input instanceof Request
            ? input.body
            : init?.body) ?? undefined,
      headers: {
        Authorization: `Bearer ${AT}`,
      },
    });

    // Handle 401 (unauthorized) - try to refresh token and retry
    if (proxyRes.status === 401) {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        // Retry with refreshed token
        proxyRes = await fetchFn(proxyUrl, {
          method: "POST",
          body:
            (typeof input === "string"
              ? init?.body
              : input instanceof Request
                ? input.body
                : init?.body) ?? undefined,
          headers: {
            Authorization: `Bearer ${refreshedToken}`,
          },
        });
      } else {
        // Refresh failed, start OAuth flow
        startOauthFlow();
        return new Response("Unauthorized", { status: 401 });
      }
    }

    if (proxyRes.status === 402) {
      // means the wallet doesn't have funds and needs to onramp, open the funding link
      const data = (await proxyRes.json()) as {
        result: { link: string; message: string };
      };
      // TODO: we can await this and then retry the call after by setting up
      // window.postMessage communication and opening this in a new tab
      const paymentUrl = new URL(data.result.link);
      paymentUrl.searchParams.set("successUrl", window.location.href);
      window.location.href = paymentUrl.toString();
      return new Response("Payment required", { status: 402 });
    }
    return proxyRes;
  };
}

//---
// Browser/Environment Utilities
//---
function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function getLocalStorage(): Storage | null {
  try {
    return hasWindow() ? window.localStorage : null;
  } catch {
    return null;
  }
}

//---
// Token Data Management
//---
let inMemoryTokenData: TokenData | null = null;

function getTokenData(): TokenData | null {
  if (inMemoryTokenData !== null) {
    return inMemoryTokenData;
  }
  const encoded = getLocalStorage()?.getItem(TOKEN_DATA_KEY);
  if (encoded) {
    const data = decodeTokenData(encoded);
    if (data) {
      inMemoryTokenData = data;
      return data;
    }
  }
  return null;
}

function setTokenData(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): void {
  if (!accessToken || accessToken === "undefined") {
    return;
  }
  if (!refreshToken || refreshToken === "undefined") {
    return;
  }
  // Calculate expiry timestamp (current time + expires_in seconds)
  const expiresAt = Date.now() + expiresIn * 1000;
  const tokenData: TokenData = { accessToken, refreshToken, expiresAt };
  const encoded = encodeTokenData(tokenData);
  getLocalStorage()?.setItem(TOKEN_DATA_KEY, encoded);
  inMemoryTokenData = tokenData;
}

function deleteTokenData(): void {
  getLocalStorage()?.removeItem(TOKEN_DATA_KEY);
  inMemoryTokenData = null;
}

function isTokenExpired(tokenData: TokenData | null): boolean {
  if (!tokenData) {
    return true;
  }
  return Date.now() >= tokenData.expiresAt - TOKEN_EXPIRY_BUFFER_MS;
}

//---
// Token Validation & Refresh
//---
/**
 * Gets a valid access token, refreshing it if necessary.
 * @returns A valid access token or null if unavailable
 */
async function getAuthToken(): Promise<string | null> {
  const tokenData = getTokenData();

  // If we have a token but it's expired, try to refresh
  if (tokenData && isTokenExpired(tokenData)) {
    const refreshedToken = await refreshAccessToken();
    return refreshedToken;
  }

  return tokenData?.accessToken ?? null;
}

/**
 * Refreshes an expired access token using the refresh token.
 * @returns A new access token or null if refresh fails
 */
async function refreshAccessToken(): Promise<string | null> {
  const tokenData = getTokenData();
  if (!tokenData) {
    return null;
  }

  try {
    const response = await fetch(`${NEXUS_API_BASE_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: tokenData.refreshToken,
        client_id: OAUTH_CLIENT_ID,
      }),
    });

    if (!response.ok) {
      // Refresh failed, clear all tokens
      deleteTokenData();
      return null;
    }

    const data = (await response.json()) as OAuthTokenResponse;

    // Store new tokens
    setTokenData(data.access_token, data.refresh_token, data.expires_in);

    return data.access_token;
  } catch (error) {
    console.error("[thirdweb nexus] Error refreshing access token", error);
    return null;
  }
}

//---
// OAuth PKCE (Proof Key for Code Exchange) Utilities
//---
function storeState(code: string): void {
  getLocalStorage()?.setItem(STATE_KEY, code);
}

function getState(): string | null | undefined {
  return getLocalStorage()?.getItem(STATE_KEY);
}

function deleteState(): void {
  getLocalStorage()?.removeItem(STATE_KEY);
}

function storeVerifier(verifier: string): void {
  getLocalStorage()?.setItem(VERIFIER_KEY, verifier);
}

function getVerifier(): string | null | undefined {
  return getLocalStorage()?.getItem(VERIFIER_KEY);
}

function deleteVerifier(): void {
  getLocalStorage()?.removeItem(VERIFIER_KEY);
}

/**
 * Generates a cryptographically random code verifier for PKCE.
 */
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Generates a code challenge from a verifier for PKCE using SHA-256.
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(hash));
}

/**
 * Base64 URL-safe encoding (without padding).
 */
function base64UrlEncode(array: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...array));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

//---
// OAuth Flow
//---
/**
 * Initiates the OAuth authorization flow by redirecting to the Nexus authorization endpoint.
 */
async function startOauthFlow(): Promise<void> {
  const state = crypto.randomUUID();
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  const redirectUri = new URL(window.location.href);
  const url = new URL("/oauth/authorize", NEXUS_API_BASE_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", OAUTH_CLIENT_ID);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);
  url.searchParams.set(
    "redirect_uri",
    `${redirectUri.origin}${redirectUri.pathname}`,
  );
  storeState(state);
  storeVerifier(verifier);

  // just open the page directly
  window.location.href = url.toString();
}

/**
 * Completes the OAuth flow by exchanging the authorization code for tokens.
 * Called automatically on page load if code parameter is present in URL.
 */
async function completeOauthFlow(): Promise<void> {
  try {
    const searchParams = new URL(window.location.href).searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("[thirdweb nexus] OAuth error:", error);
      return;
    }

    if (!code || !state) {
      // No code or state found, nothing to do
      return;
    }

    if (state !== getState()) {
      // State mismatch - possible CSRF attack
      console.warn("[thirdweb nexus] OAuth state mismatch");
      return;
    }

    const verifier = getVerifier();
    if (!verifier) {
      // No verifier found, nothing to do
      return;
    }

    // Delete the state and verifier so they can't be reused
    deleteState();
    deleteVerifier();

    const redirectUri = new URL(window.location.href);
    const response = await fetch(`${NEXUS_API_BASE_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        code_verifier: verifier,
        grant_type: "authorization_code",
        redirect_uri: `${redirectUri.origin}${redirectUri.pathname}`,
        client_id: OAUTH_CLIENT_ID,
      }),
    });

    if (!response.ok) {
      console.error(
        "[thirdweb nexus] Failed to exchange authorization code for tokens",
      );
      return;
    }

    const data = (await response.json()) as OAuthTokenResponse;

    // Store all token data
    setTokenData(data.access_token, data.refresh_token, data.expires_in);
  } catch (error) {
    console.error("[thirdweb nexus] Error completing OAuth flow:", error);
  }
}
