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

// combine generic + custom ones
export type WalletId =
  | CustomWalletIds
  | WCSupportedWalletIds
  | InjectedSupportedWalletIds;

export type CustomWalletIds = "local" | "embedded" | "smart";

// connect options
export type InjectedConnectOptions = {
  chain?: Chain;
};

type InjectedAutoConnectOptions = undefined;

// TODO
type LocalWalletConnectOptions = {
  todo: true;
};

type LocalWalletAutoConnectOptions = {
  todo: true;
};

type EmbeddedWalletCreationOptions =
  | {
      auth?: {
        options: EmbeddedWalletAuth[];
      };
    }
  | undefined;

// wallet.connect types
export type WalletConnectionOption<T extends WalletId> = T extends "smart"
  ? SmartWalletConnectionOptions
  : T extends "local"
    ? // locale wallet
      LocalWalletConnectOptions
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

// wallet.autoConnect types
export type WalletAutoConnectionOption<T extends WalletId> = T extends "smart"
  ? SmartWalletConnectionOptions
  : T extends "local"
    ? // locale wallet
      LocalWalletAutoConnectOptions
    : // embedded wallet
      T extends "embedded"
      ? EmbeddedWalletAutoConnectOptions
      : // coinbase wallet (inhected + coinbaseWallet)
        T extends "com.coinbase.wallet"
        ? InjectedConnectOptions | CoinbaseSDKWalletConnectionOptions
        : // injected + wc both supported
          T extends InjectedSupportedWalletIds & WCSupportedWalletIds
          ? InjectedAutoConnectOptions | WCAutoConnectOptions
          : // injected only
            T extends InjectedSupportedWalletIds
            ? InjectedAutoConnectOptions
            : // wc only
              WCAutoConnectOptions;

export type WalletCreationOptions<T extends WalletId> = T extends "smart"
  ? SmartWalletOptions
  : T extends "embedded"
    ? EmbeddedWalletCreationOptions
    : undefined;

// generic args for createWallet(...args) or new Wallet(...args)
export type CreateWalletArgs<T extends WalletId> =
  WalletCreationOptions<T> extends undefined
    ? [id: T]
    : undefined extends WalletCreationOptions<T>
      ? [id: T, options?: WalletCreationOptions<T>]
      : [id: T, options: WalletCreationOptions<T>];
