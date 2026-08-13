import { randomBytesHex } from "../../../../../utils/random.js";
import { webLocalStorage } from "../../../../../utils/storage/webStorage.js";

const REDIRECT_STATE_STORAGE_KEY = "thirdweb:auth-redirect-state";
const REDIRECT_STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes
// Bound how many concurrent redirect flows we track so a page that repeatedly
// starts logins cannot grow storage without limit.
const MAX_PENDING_STATES = 10;

type PendingState = { state: string; expiresAt: number };

async function readPendingStates(): Promise<PendingState[]> {
  const stored = await webLocalStorage.getItem(REDIRECT_STATE_STORAGE_KEY);
  if (!stored) {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) {
    return [];
  }
  const now = Date.now();
  // Drop malformed and expired entries.
  return parsed.filter(
    (entry): entry is PendingState =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as PendingState).state === "string" &&
      typeof (entry as PendingState).expiresAt === "number" &&
      (entry as PendingState).expiresAt > now,
  );
}

async function writePendingStates(entries: PendingState[]): Promise<void> {
  await webLocalStorage.setItem(
    REDIRECT_STATE_STORAGE_KEY,
    JSON.stringify(entries),
  );
}

/**
 * Creates a one-time state value bound to this browser, persists it alongside any
 * other in-flight values, and returns it to be sent as the `state` parameter when
 * starting a redirect auth flow.
 * @internal
 */
export async function storeRedirectState(): Promise<string> {
  const state = randomBytesHex(16);
  // readPendingStates prunes expired entries; cap the list so it stays bounded.
  const pending = await readPendingStates();
  const next = [
    ...pending,
    { expiresAt: Date.now() + REDIRECT_STATE_TTL_MS, state },
  ].slice(-MAX_PENDING_STATES);
  await writePendingStates(next);
  return state;
}

/**
 * Validates the `state` returned from a redirect auth flow against the pending
 * values stored when flows were started. On a match it removes only that entry so
 * it cannot be reused, and leaves other in-flight flows untouched. Returns `false`
 * when the value is missing, expired, or unknown — without disturbing other flows.
 * @internal
 */
export async function consumeRedirectState(
  returnedState: string | undefined,
): Promise<boolean> {
  if (!returnedState) {
    return false;
  }
  const pending = await readPendingStates();
  const index = pending.findIndex((entry) => entry.state === returnedState);
  if (index === -1) {
    return false;
  }
  // one-time use: remove only the matching entry, preserving other pending flows
  pending.splice(index, 1);
  await writePendingStates(pending);
  return true;
}
