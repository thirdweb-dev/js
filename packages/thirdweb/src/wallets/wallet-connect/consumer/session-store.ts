import { LocalStorage } from "../../in-app/web/utils/Storage/LocalStorage.js";
import type { WalletConnectSession } from "./types.js";

/**
 * @internal
 */
export let walletConnectSessions: LocalStorage | undefined;

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
export function initializeSessionStore(options: {
  clientId: string;
}) {
  if (!walletConnectSessions) {
    walletConnectSessions = new LocalStorage({
      clientId: options.clientId,
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
  await walletConnectSessions.saveWalletConnectSessions(
    JSON.stringify(sessions),
  );
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
  await walletConnectSessions.saveWalletConnectSessions(
    JSON.stringify(newSessions),
  );
}

/**
 * @internal FOR TESTING ONLY
 */
export function setWalletConnectSessions(
  storage: LocalStorage | undefined,
): void {
  walletConnectSessions = storage;
}
