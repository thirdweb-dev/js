import { randomBytesHex } from "../../../../../utils/random.js";

// Each pending redirect flow is stored under its own key so that starting a flow
// is a single atomic write (no shared list to read-modify-write) and consuming one
// flow never touches another. The stored value is the expiry timestamp.
const REDIRECT_STATE_KEY_PREFIX = "thirdweb:auth-redirect-state:";
const REDIRECT_STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getStorage(): Storage | undefined {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // localStorage access can throw in sandboxed / blocked contexts
  }
  return undefined;
}

/**
 * Remove expired pending states so a page that repeatedly starts logins without
 * completing them cannot grow storage without bound.
 */
function pruneExpiredStates(storage: Storage, now: number): void {
  const expiredKeys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith(REDIRECT_STATE_KEY_PREFIX)) {
      const expiresAt = Number(storage.getItem(key));
      if (!Number.isFinite(expiresAt) || expiresAt <= now) {
        expiredKeys.push(key);
      }
    }
  }
  for (const key of expiredKeys) {
    storage.removeItem(key);
  }
}

/**
 * Creates a one-time state value bound to this browser, persists it under its own
 * key, and returns it to be sent as the `state` parameter when starting a redirect
 * auth flow.
 * @internal
 */
export async function storeRedirectState(): Promise<string> {
  const state = randomBytesHex(16);
  const storage = getStorage();
  if (storage) {
    const now = Date.now();
    pruneExpiredStates(storage, now);
    storage.setItem(
      `${REDIRECT_STATE_KEY_PREFIX}${state}`,
      String(now + REDIRECT_STATE_TTL_MS),
    );
  }
  return state;
}

/**
 * Validates the `state` returned from a redirect auth flow against the value stored
 * when that flow started. Consumes only the matching key (one-time use), leaving any
 * other in-flight flows untouched. Returns `false` when the value is missing,
 * expired, or unknown.
 * @internal
 */
export async function consumeRedirectState(
  returnedState: string | undefined,
): Promise<boolean> {
  if (!returnedState) {
    return false;
  }
  const storage = getStorage();
  if (!storage) {
    return false;
  }
  const key = `${REDIRECT_STATE_KEY_PREFIX}${returnedState}`;
  const expiresAt = Number(storage.getItem(key));
  // one-time use: remove this specific key; unrelated flows are untouched
  storage.removeItem(key);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}
