import { coinbaseMetadata } from "../../coinbase/coinbaseMetadata.js";
import { InjectedWallet } from "../index.js";
import { injectedProvider } from "../mipdStore.js";

/**
 * `coinbaseWallet` allows you to connect to the Coinbase Wallet extension.
 *
 * If you want to connect to Coinbase wallet mobile app, use [`coinbaseSDKWallet`](https://portal.thirdweb.com/references/typescript/v5/coinbaseSDKWallet) instead.
 * @wallet
 * @example
 * ```ts
 * import { coinbaseWallet, injectedCoinbaseProvider } from "thirdweb/wallets";
 *
 * async function connectToCoinbaseExtension() {
 *   const isInstalled = !!injectedCoinbaseProvider();
 *
 *   // if coinbase extension is installed, it
 *   if (isInstalled) {
 *     // create an instance
 *     const wallet = coinbaseWallet();
 *     try {
 *       const account = await wallet.connect(); // connect to it
 *       console.log("connected to", account);
 *     } catch (e) {
 *       console.error("error connecting to coinbase extension", e);
 *     }
 *   }
 *
 *   // else prompt user to connect to Coinbase wallet app by scanning a QR code
 *   else {
 *     // refer to `coinbaseSDKWallet` documentation
 *   }
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
export function coinbaseWallet() {
  return new InjectedWallet({
    walletId: coinbaseMetadata.id,
    metadata: coinbaseMetadata,
  });
}

/**
 * Get the injected Coinbase wallet provider
 * @example
 * ```ts
 * const provider = injectedCoinbaseProvider();
 * ```
 * @returns The injected coinbase wallet provider of type `Ethereum` or `undefined` if Coinbase Wallet extension is not installed
 * @walletUtils
 */
export function injectedCoinbaseProvider() {
  return injectedProvider(coinbaseMetadata.id);
}
