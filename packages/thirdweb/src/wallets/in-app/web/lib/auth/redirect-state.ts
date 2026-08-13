import { randomBytesHex } from "../../../../../utils/random.js";
import { webLocalStorage } from "../../../../../utils/storage/webStorage.js";

const REDIRECT_STATE_STORAGE_KEY = "thirdweb:auth-redirect-state";
const REDIRECT_STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Creates a one-time state value bound to this browser, persists it, and returns
 * it so it can be sent as the `state` parameter when starting a redirect auth flow.
 * @internal
 */
export async function storeRedirectState(): Promise<string> {
  const state = randomBytesHex(16);
  await webLocalStorage.setItem(
    REDIRECT_STATE_STORAGE_KEY,
    JSON.stringify({ expiresAt: Date.now() + REDIRECT_STATE_TTL_MS, state }),
  );
  return state;
}

/**
 * Validates the `state` returned from a redirect auth flow against the one-time
 * value stored when the flow started, then clears it so it cannot be reused.
 * Returns `false` when nothing was stored, the value is expired, or it does not match.
 * @internal
 */
export async function consumeRedirectState(
  returnedState: string | undefined,
): Promise<boolean> {
  const stored = await webLocalStorage.getItem(REDIRECT_STATE_STORAGE_KEY);
  // one-time use: always clear the stored value, even on a mismatch
  await webLocalStorage.removeItem(REDIRECT_STATE_STORAGE_KEY);

  if (!stored || !returnedState) {
    return false;
  }

  try {
    const parsed = JSON.parse(stored) as {
      state?: unknown;
      expiresAt?: unknown;
    };
    if (
      typeof parsed.state !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return false;
    }
    if (Date.now() > parsed.expiresAt) {
      return false;
    }
    return parsed.state === returnedState;
  } catch {
    return false;
  }
}
