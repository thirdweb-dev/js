import { type Store, createStore } from "mipd";
import type { Ethereum } from "../interfaces/ethereum.js";
import type { WalletId } from "../wallet-types.js";

declare module "mipd" {
  export interface Register {
    rdns: WalletId;
  }
}

// if we're in the browser -> create the store once immediately
const mipdStore: Store | undefined = /* @__PURE__ */ (() =>
  typeof window !== "undefined" ? createStore() : undefined)();

/**
 * Get Injected Provider for given wallet by passing a wallet ID (rdns) using [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) Provider Discovery.
 * @param walletId - The Wallet Id (rdns) to check.
 * @example
 * ```ts
 * import { injectedProvider } from "thirdweb/wallets";
 *
 * const metamaskProvider = injectedProvider("io.metamask");
 *
 * if (metamaskProvider) {
 *  console.log("Metamask is installed");
 * }
 * ```
 * @returns The details of the Injected Provider if it exists. `undefined` otherwise.
 * @walletUtils
 */
export function injectedProvider(walletId: WalletId): Ethereum | undefined {
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
