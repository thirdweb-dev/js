import type { AdapterWalletOptions } from "../adapters/wallet-adapter.js";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type {
  DeepLinkSupportedWalletIds,
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "./__generated__/wallet-ids.js";
import type {
  CoinbaseSDKWalletConnectionOptions,
  CoinbaseWalletCreationOptions,
} from "./coinbase/coinbaseWebSDK.js";
import type { COINBASE } from "./constants.js";
import type {
  EcosystemWalletAutoConnectOptions,
  EcosystemWalletConnectionOptions,
  EcosystemWalletCreationOptions,
} from "./ecosystem/types.js";
import type {
  InAppWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
  InAppWalletCreationOptions,
} from "./in-app/core/wallet/types.js";
import type {
  SmartWalletConnectionOptions,
  SmartWalletOptions,
} from "./smart/types.js";
import type {
  WCAutoConnectOptions,
  WCConnectOptions,
} from "./wallet-connect/types.js";

export type WalletId =
  | "walletConnect"
  | "inApp"
  | "embedded" // deprecated
  | "smart"
  | "adapter"
  | EcosystemWalletId
  | WCSupportedWalletIds
  | InjectedSupportedWalletIds;

export type EcosystemWalletId = `ecosystem.${string}`;

export type DeepLinkSupportedWalletCreationOptions =
  | {
      /**
       * Redirect the user to wallet app and open the current page in the wallet's in-app browser instead of using WalletConnect on mobile devices when using Connect UI (ConnectButton / ConnectEmbed components)
       *
       * By default, this is set to `false` and WalletConnect will be used on mobile devices when using Connect UI.
       */
      preferDeepLink?: boolean;
    }
  | undefined;

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
      : // inApp wallet
        T extends "inApp" | "embedded"
        ? InAppWalletConnectionOptions
        : // coinbase wallet (inhected + coinbaseWallet)
          T extends typeof COINBASE
          ? InjectedConnectOptions | CoinbaseSDKWalletConnectionOptions
          : // injected + wc both supported
            T extends InjectedSupportedWalletIds & WCSupportedWalletIds
            ? InjectedConnectOptions | WCConnectOptions
            : // injected only
              T extends InjectedSupportedWalletIds
              ? InjectedConnectOptions
              : T extends EcosystemWalletId
                ? EcosystemWalletConnectionOptions
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
      : T extends "inApp" | "embedded"
        ? InAppWalletAutoConnectOptions
        : // coinbase wallet (inhected + coinbaseWallet)
          T extends typeof COINBASE
          ? InjectedConnectOptions | CoinbaseSDKWalletConnectionOptions
          : // injected + wc both supported
            T extends InjectedSupportedWalletIds & WCSupportedWalletIds
            ? InjectedConnectOptions | WCAutoConnectOptions
            : // injected only
              T extends InjectedSupportedWalletIds
              ? InjectedConnectOptions
              : T extends EcosystemWalletId
                ? EcosystemWalletAutoConnectOptions
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
  : T extends "inApp" | "embedded"
    ? InAppWalletCreationOptions
    : T extends typeof COINBASE
      ? CoinbaseWalletCreationOptions
      : T extends "adapter"
        ? AdapterWalletOptions
        : T extends DeepLinkSupportedWalletIds
          ? DeepLinkSupportedWalletCreationOptions
          : T extends EcosystemWalletId
            ? EcosystemWalletCreationOptions | undefined
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
