import type { Ethereum } from "../../interfaces/ethereum.js";
import type { WalletMetadata } from "../../types.js";
import { InjectedWallet } from "../index.js";

export const okxWalletMetadata: WalletMetadata = {
  id: "com.okx",
  name: "OKX Wallet",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik00Ni4wMjg0IDMyLjk2NjhIMzMuMDE5OUMzMi40Njc3IDMyLjk2NjggMzIuMDE1IDMzLjQxOTUgMzIuMDE1IDMzLjk3MTZWNDYuOTgwMUMzMi4wMTUgNDcuNTMyMyAzMi40Njc3IDQ3Ljk4NSAzMy4wMTk5IDQ3Ljk4NUg0Ni4wMjg0QzQ2LjU4MDUgNDcuOTg1IDQ3LjAzMzIgNDcuNTMyMyA0Ny4wMzMyIDQ2Ljk4MDFWMzMuOTcxNkM0Ny4wMzMyIDMzLjQxOTUgNDYuNTgwNSAzMi45NjY4IDQ2LjAyODQgMzIuOTY2OFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zMS4wMTMzIDE4SDE4LjAwNDlDMTcuNDUyNyAxOCAxNyAxOC40NTI3IDE3IDE5LjAwNDlWMzIuMDEzM0MxNyAzMi41NjU1IDE3LjQ1MjcgMzMuMDE4MiAxOC4wMDQ5IDMzLjAxODJIMzEuMDEzM0MzMS41NjU1IDMzLjAxODIgMzIuMDE4MiAzMi41NjU1IDMyLjAxODIgMzIuMDEzM1YxOS4wMDQ5QzMyLjAxNSAxOC40NTI3IDMxLjU2NTUgMTggMzEuMDEzMyAxOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik02MC45OTUyIDE4SDQ3Ljk4NjdDNDcuNDM0NSAxOCA0Ni45ODE4IDE4LjQ1MjcgNDYuOTgxOCAxOS4wMDQ5VjMyLjAxMzNDNDYuOTgxOCAzMi41NjU1IDQ3LjQzNDUgMzMuMDE4MiA0Ny45ODY3IDMzLjAxODJINjAuOTk1MkM2MS41NDczIDMzLjAxODIgNjIgMzIuNTY1NSA2MiAzMi4wMTMzVjE5LjAwNDlDNjIgMTguNDUyNyA2MS41NDczIDE4IDYwLjk5NTIgMThaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzEuMDEzMyA0Ny45MzM3SDE4LjAwNDlDMTcuNDUyNyA0Ny45MzM3IDE3IDQ4LjM4NjQgMTcgNDguOTM4NlY2MS45NDcxQzE3IDYyLjQ5OTIgMTcuNDUyNyA2Mi45NTE5IDE4LjAwNDkgNjIuOTUxOUgzMS4wMTMzQzMxLjU2NTUgNjIuOTUxOSAzMi4wMTgyIDYyLjQ5OTIgMzIuMDE4MiA2MS45NDcxVjQ4LjkzODZDMzIuMDE1IDQ4LjM4NjQgMzEuNTY1NSA0Ny45MzM3IDMxLjAxMzMgNDcuOTMzN1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik02MC45OTUyIDQ3LjkzMzdINDcuOTg2N0M0Ny40MzQ1IDQ3LjkzMzcgNDYuOTgxOCA0OC4zODY0IDQ2Ljk4MTggNDguOTM4NlY2MS45NDcxQzQ2Ljk4MTggNjIuNDk5MiA0Ny40MzQ1IDYyLjk1MTkgNDcuOTg2NyA2Mi45NTE5SDYwLjk5NTJDNjEuNTQ3MyA2Mi45NTE5IDYyIDYyLjQ5OTIgNjIgNjEuOTQ3MVY0OC45Mzg2QzYyIDQ4LjM4NjQgNjEuNTQ3MyA0Ny45MzM3IDYwLjk5NTIgNDcuOTMzN1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
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
