"use client";

import { useConnectionManagerCtx } from "../../providers/connection-manager.js";

/**
 * A hook to add a connected wallet without setting the active wallet.
 * @returns A function that lets you add a connected wallet.
 * @example
 * ```jsx
 * import { useAddConnectedWallet } from "thirdweb/react";
 *
 * const addConnectedWallet = useAddConnectedWallet();
 *
 * // later in your code
 * await addConnectedWallet(wallet);
 * ```
 * @walletConnection
 */
export function useAddConnectedWallet() {
  const manager = useConnectionManagerCtx("useAddConnectedWallet");
  return manager.addConnectedWallet;
}
