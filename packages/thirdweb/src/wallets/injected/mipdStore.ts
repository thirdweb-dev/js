import { createStore, type Store } from "mipd";
import type { Ethereum } from "../interfaces/ethereum.js";
import type { WalletRDNS } from "./types.js";

// if we're in the browser -> create the store once immediately
const mipdStore: Store | undefined = /* @__PURE__ */ (() =>
  typeof window !== "undefined" ? createStore() : undefined)();

/**
 * Get the details of Injected Provider with given a wallet ID (rdns) using [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) Provider Discovery.
 * @param walletId - The Wallet Id (rdns) to check.
 * @example
 * ```ts
 * import { isInjected } from "thirdweb/wallets";
 *
 * const metamaskProvider = injectedProvider("io.metamask");
 * const coinbaseProvider = injectedProvider("com.coinbase");
 * ```
 * @returns The details of the Injected Provider if it exists. `undefined` otherwise.
 */
export function injectedProvider(walletId: WalletRDNS): Ethereum | undefined {
  if (!mipdStore) {
    throw new Error("store not initialized");
  }

  const store = getMIPDStore();

  const injectedProviderDetail = store.findProvider({
    rdns: walletId,
  });

  return injectedProviderDetail?.provider as Ethereum | undefined;
}

/**
 * Get Injected Provider Details for given wallet ID (rdns)
 * @internal
 */
export function getMIPDStore() {
  if (!mipdStore) {
    throw new Error("MIPD store not initialized");
  }
  return mipdStore;
}
