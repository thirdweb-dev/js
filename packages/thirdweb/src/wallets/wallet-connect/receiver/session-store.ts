import { stringify } from "../../../utils/json.js";
import { ClientScopedStorage } from "../../in-app/core/authentication/client-scoped-storage.js";
import type { WalletConnectSession } from "./types.js";

/**
 * @internal
 */
export let walletConnectSessions: ClientScopedStorage | undefined;

/**
 * @internal
 */
export async function getSessions(): Promise<WalletConnectSession[]> {
  if (!walletConnectSessions) {
    return [];
  }
  const stringifiedSessions =
    await walletConnectSessions.getWalletConnectSessions();
  return JSON.parse(stringifiedSessions ?? "[]");
}

/**
 * @internal
 */
export function initializeSessionStore(options: { clientId: string }) {
  if (!walletConnectSessions) {
    walletConnectSessions = new ClientScopedStorage({
      clientId: options.clientId, // TODO: inject storage
      storage: null,
    });
  }
}

/**
 * @internal
 */
export async function saveSession(
  session: WalletConnectSession,
): Promise<void> {
  if (!walletConnectSessions) {
    return;
  }
  const stringifiedSessions =
    await walletConnectSessions.getWalletConnectSessions();
  const sessions = JSON.parse(stringifiedSessions ?? "[]");
  sessions.push(session);
  await walletConnectSessions.saveWalletConnectSessions(stringify(sessions));
}

/**
 * @internal
 */
export async function removeSession(
  session: WalletConnectSession,
): Promise<void> {
  if (!walletConnectSessions) {
    return;
  }
  const stringifiedSessions =
    await walletConnectSessions.getWalletConnectSessions();
  const sessions = JSON.parse(stringifiedSessions ?? "[]");
  const newSessions = sessions.filter(
    (s: WalletConnectSession) => s.topic !== session.topic,
  );
  await walletConnectSessions.saveWalletConnectSessions(stringify(newSessions));
}

/**
 * @internal FOR TESTING ONLY
 */
export function setWalletConnectSessions(
  storage: ClientScopedStorage | undefined,
): void {
  walletConnectSessions = storage;
}
