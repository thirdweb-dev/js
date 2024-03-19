import type { Ethereum } from "../../interfaces/ethereum.js";
import type { WalletMetadata } from "../../types.js";
import { InjectedWallet } from "../index.js";

export const okxWalletMetadata: WalletMetadata = {
  id: "com.okx",
  name: "OKX Wallet",
  // TODO: add icon
  iconUrl: "",
};

/**
 * `okxWallet` allows you to connect to the MetaMask Wallet extension.
 *
 * If you want to connect to MetaMask wallet mobile app, use [`walletConnect`](https://portal.thirdweb.com/references/typescript/v5/walletConnect) instead.
 * @wallet
 * @example
 * ```ts
 * import { okxWallet, injectedOkxProvider } from "thirdweb/wallets";
 *
 * async function connectToMetamask() {
 *   const isInstalled = !!injectedOkxProvider();
 *
 *   // if metamask extension is installed, connect to MetaMask extension
 *   if (isInstalled) {
 *     // create an instance
 *     const wallet = okxWallet();
 *     try {
 *       const account = await wallet.connect(); // connect to it
 *       console.log("connected to", account);
 *     } catch (e) {
 *       console.error("error connecting to metamask", e);
 *     }
 *   }
 *
 * }
 * ```
 *
 * If you want the wallet to be connected to a specific blockchain, you can pass a `Chain` object to the `connect` method.
 * This will trigger a chain switch if the wallet provider is not already connected to the specified chain.
 *
 * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
 * At minimum, you need to pass the `id` of the blockchain.
 *
 * ```ts
 * import { defineChain } from "thirdweb";
 * const mumbai = defineChain({
 *  id: 80001,
 * });
 *
 * const address = await wallet.connect({ chain: mumbai })
 * ```
 * @returns The `InjectedWallet` instance
 */
export function okxWallet() {
  return new InjectedWallet({
    metadata: okxWalletMetadata,
    getProvider: () => injectedOkxProvider(),
  });
}

/**
 * Get the injected OKX Wallet provider. It returns `undefined` if OKX Wallet is not installed.
 * @example
 * ```ts
 * const provider = injectedOkxProvider();
 * ```
 * @returns The injected OKX wallet provider of type `Ethereum`
 * @walletUtils
 */
export function injectedOkxProvider() {
  return typeof window !== "undefined" && "okxwallet" in window
    ? (window.okxwallet as Ethereum)
    : undefined;
}
