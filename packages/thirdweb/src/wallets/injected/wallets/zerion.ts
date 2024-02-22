import { InjectedWallet } from "../index.js";
import { injectedProvider } from "../mipdStore.js";

export const zerionWalletMetadata = {
  id: "io.zerion.wallet",
  name: "Zerion Wallet",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMyMzYxRUMiLz4KPHBhdGggZD0iTTE3LjM3OSAyMEMxNi4wMDggMjAgMTUuNDc5OCAyMS42OTUyIDE2LjYzMDEgMjIuNDAzNEw0NS40MDk0IDM5Ljc1NjJDNDYuMTI2OCA0MC4xOTc4IDQ3LjA4MzUgNDAuMDIzNCA0Ny41Nzc0IDM5LjM2MDhMNjAuMjMwOSAyMi43NDlDNjEuMDkxMiAyMS41OTUgNjAuMjIyIDIwIDU4LjczMjkgMjBIMTcuMzc5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYyLjYxMTcgNjAuMDAwMUM2My45ODI3IDYwLjAwMDEgNjQuNTI0NSA1OC4yOTU1IDYzLjM3NDMgNTcuNTg3NUwzNC41ODY4IDQwLjIzNjlDMzMuODY5NCAzOS43OTUzIDMyLjkzNTkgMzkuOTkxOSAzMi40NDIxIDQwLjY1NDNMMTkuNzY0IDU3LjI2MjlDMTguOTAzOSA1OC40MTY3IDE5LjgwMDMgNjAuMDAwMSAyMS4yODkyIDYwLjAwMDFINjIuNjExN1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
};

/**
 * `zerionWallet` allows you to connect to the Zerion Wallet extension.
 *
 * If you want to connect to Zerion wallet mobile app, use [`walletConnect`](https://portal.thirdweb.com/references/typescript/v5/walletConnect) instead.
 * @wallet
 * @example
 * ```ts
 * import { zerionWallet, injectedZerionProvider } from "thirdweb/wallets";
 *
 * async function connectToZerion() {
 *   const isInstalled = !!injectedZerionProvider();
 *
 *   // if Zerion Wallet extension is installed, connect to it
 *   if (isInstalled) {
 *     // create an instance
 *     const wallet = zerionWallet();
 *     try {
 *       const account = await wallet.connect(); // connect to it
 *       console.log("connected to", account);
 *     } catch (e) {
 *       console.error("error connecting to zerion wallet extension", e);
 *     }
 *   }
 *
 *   // else prompt user to connect to Zerion wallet app by scanning a QR code
 *   else {
 *     // refer to `walletConnect` documentation
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
export function zerionWallet() {
  return new InjectedWallet({
    walletId: zerionWalletMetadata.id,
    metadata: zerionWalletMetadata,
  });
}

/**
 * Get the injected Zerion provider. If Zerion Wallet is not installed, it returns `undefined`
 * @example
 * ```ts
 * const provider = injectedZerionProvider();
 * ```
 * @returns The injected Zerion Wallet provider of type `Ethereum` or `undefined` if Zerion Wallet is not installed
 * @walletUtils
 */
export function injectedZerionProvider() {
  return injectedProvider(zerionWalletMetadata.id);
}
