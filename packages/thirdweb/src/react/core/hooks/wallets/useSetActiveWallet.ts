"use client";

import { useConnectionManagerCtx } from "../../providers/connection-manager.js";

/**
 * A hook that lets you set the active wallet.
 * @returns A function that lets you set the active wallet.
 * @example
 * ```jsx
 * import { useSetActiveWallet } from "thirdweb/react";
 *
 * const setActiveWallet = useSetActiveWallet();
 *
 * // later in your code
 * await setActiveWallet(wallet);
 * ```
 * @walletConnection
 */
export function useSetActiveWallet() {
  const manager = useConnectionManagerCtx("useSetActiveWallet");
  return manager.setActiveWallet;
}
