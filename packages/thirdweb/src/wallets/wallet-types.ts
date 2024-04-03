import type { Chain } from "../chains/types.js";
import type {
  WCConnectOptions,
  WCAutoConnectOptions,
} from "./wallet-connect/types.js";
import type {
  WCSupportedWalletIds,
  InjectedSupportedWalletIds,
} from "./__generated__/wallet-ids.js";
import type {
  SmartWalletConnectionOptions,
  SmartWalletOptions,
} from "./smart/types.js";
import type {
  EmbeddedWalletAuth,
  EmbeddedWalletAutoConnectOptions,
  EmbeddedWalletConnectionOptions,
} from "./embedded/core/wallet/index.js";
import type { CoinbaseSDKWalletConnectionOptions } from "./coinbase/coinbaseSDKWallet.js";
import type { ThirdwebClient } from "../client/client.js";

export type WalletId =
  | "walletConnect"
  | "embedded"
  | "smart"
  | WCSupportedWalletIds
  | InjectedSupportedWalletIds;

export type StandaloneWCConnectOptions = WCConnectOptions["walletConnect"] & {
  client: ThirdwebClient;
  /**
   * Optional chain to connect to.
   */
  chain?: Chain;
};

// connect options
export type InjectedConnectOptions = {
  /**
   * The Thirdweb client.
   */
  client: ThirdwebClient;
  /**
   * Optional chain to connect to.
   */
  chain?: Chain;
};

export type EmbeddedWalletCreationOptions =
  | {
      auth?: {
        options: EmbeddedWalletAuth[];
      };
    }
  | undefined;

/**
 * Generic type for getting the type of object that the `wallet.connect` method takes as the first argument.
 * @example
 * ```ts
 * type X = WalletConnectionOption<'io.metamask'>
 * ````
 */
export type WalletConnectionOption<T extends WalletId> =
  T extends "walletConnect"
    ? StandaloneWCConnectOptions
    : T extends "smart"
      ? SmartWalletConnectionOptions
      : // embedded wallet
        T extends "embedded"
        ? EmbeddedWalletConnectionOptions
        : // coinbase wallet (inhected + coinbaseWallet)
          T extends "com.coinbase.wallet"
          ? InjectedConnectOptions | CoinbaseSDKWalletConnectionOptions
          : // injected + wc both supported
            T extends InjectedSupportedWalletIds & WCSupportedWalletIds
            ? InjectedConnectOptions | WCConnectOptions
            : // injected only
              T extends InjectedSupportedWalletIds
              ? InjectedConnectOptions
              : // wc only
                WCConnectOptions;

/**
 * Generic type for getting the type of object that the `wallet.autoConnect` method takes as the first argument.
 * @example
 * ```ts
 * type X = WalletAutoConnectionOption<'io.metamask'>
 * ````
 */
export type WalletAutoConnectionOption<T extends WalletId> =
  T extends "walletConnect"
    ? WCAutoConnectOptions
    : T extends "smart"
      ? SmartWalletConnectionOptions
      : T extends "embedded"
        ? EmbeddedWalletAutoConnectOptions
        : // coinbase wallet (inhected + coinbaseWallet)
          T extends "com.coinbase.wallet"
          ? InjectedConnectOptions | CoinbaseSDKWalletConnectionOptions
          : // injected + wc both supported
            T extends InjectedSupportedWalletIds & WCSupportedWalletIds
            ? InjectedConnectOptions | WCAutoConnectOptions
            : // injected only
              T extends InjectedSupportedWalletIds
              ? InjectedConnectOptions
              : // wc only
                WCAutoConnectOptions;
/**
 * Generic type for getting the type of object that the `createWallet` function takes as the second argument. ( the first argument being the wallet id )
 * @example
 * ```ts
 * type X = WalletCreationOptions<'io.metamask'>
 * ````
 */
export type WalletCreationOptions<T extends WalletId> = T extends "smart"
  ? SmartWalletOptions
  : T extends "embedded"
    ? EmbeddedWalletCreationOptions
    : undefined;

/**
 * Generic type for getting the tuple type of arguments that the `createWallet` function takes.
 * @example
 * ```ts
 * type X = CreateWalletArgs<'io.metamask'>
 * ```
 */
export type CreateWalletArgs<T extends WalletId> =
  WalletCreationOptions<T> extends undefined
    ? [id: T]
    : undefined extends WalletCreationOptions<T>
      ? [id: T, options?: WalletCreationOptions<T>]
      : [id: T, options: WalletCreationOptions<T>];
