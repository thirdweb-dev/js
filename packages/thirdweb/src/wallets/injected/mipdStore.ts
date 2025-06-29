import { createStore, type EIP6963ProviderDetail, type Store } from "mipd";
import { isBrowser } from "../../utils/platform.js";
import type { InjectedSupportedWalletIds } from "../__generated__/wallet-ids.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import type { Ethereum } from "../interfaces/ethereum.js";
import type { Wallet } from "../interfaces/wallet.js";
import type { WalletId } from "../wallet-types.js";

declare module "mipd" {
  export interface Register {
    rdns: WalletId;
  }
}

// if we're in the browser -> create the store once immediately
const mipdStore: Store | undefined = /* @__PURE__ */ (() =>
  isBrowser() ? createStore() : undefined)();

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
  const injectedProviderDetail = getInstalledWalletProviders().find(
    (p) => p.info.rdns === walletId,
  );

  return injectedProviderDetail?.provider as Ethereum | undefined;
}

/**
 * Get All currently installed wallets.
 * Uses EIP-6963 to discover installed browser extension wallets.
 * @returns a list of installed wallets
 */
export function getInstalledWallets(): Wallet[] {
  const providers = getInstalledWalletProviders();
  const walletIds = providers.map((provider) => provider.info.rdns);
  return walletIds.map((w) => createWallet(w as InjectedSupportedWalletIds));
}

/**
 * Get Injected Provider Details for given wallet ID (rdns)
 * @internal
 */
function getMIPDStore() {
  if (!mipdStore) {
    return undefined;
  }
  return mipdStore;
}

export function getInstalledWalletProviders(): readonly EIP6963ProviderDetail[] {
  const providers = getMIPDStore()?.getProviders() || [];

  for (const provider of providers) {
    // Map io.metamask.mobile to io.metamask rdns to fix double entry issue in MetaMask mobile browser
    if ((provider.info.rdns as string) === "io.metamask.mobile") {
      provider.info.rdns = METAMASK;
      break;
    }
  }

  return providers;
}
