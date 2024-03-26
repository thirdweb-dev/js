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
  EmbeddedWalletAutoConnectOptions,
  EmbeddedWalletConnectionOptions,
} from "./embedded/core/wallet/index.js";

// combine generic + custom ones
export type WalletId =
  | "local"
  | "embedded"
  | "smart"
  | WCSupportedWalletIds
  | InjectedSupportedWalletIds;

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

// wallet.connect types
export type WalletConnectionOption<T extends WalletId> = T extends "smart"
  ? SmartWalletConnectionOptions
  : T extends "local"
    ? // locale wallet
      LocalWalletConnectOptions
    : // embedded wallet
      T extends "embedded"
      ? EmbeddedWalletConnectionOptions
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
      : // injected + wc both supported
        T extends InjectedSupportedWalletIds & WCSupportedWalletIds
        ? InjectedAutoConnectOptions | WCAutoConnectOptions
        : // injected only
          T extends InjectedSupportedWalletIds
          ? InjectedAutoConnectOptions
          : // wc only
            WCAutoConnectOptions;

// wallet creation options

// type EmbeddedWalletCreationOptions = {};

export type WalletCreationOptions<T extends WalletId> = T extends "smart"
  ? SmartWalletOptions
  : T extends "embedded"
    ? // TODO add otpinal options here later (?)
      undefined
    : undefined;

// generic args for createWallet(...args) or new Wallet(...args)
export type CreateWalletArgs<T extends WalletId> =
  WalletCreationOptions<T> extends undefined
    ? [T]
    : [T, WalletCreationOptions<T>];
