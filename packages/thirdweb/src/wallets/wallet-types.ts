import type { Chain } from "../chains/types.js";
import type {
  WCConnectOptions,
  WCAutoConnectOptions,
} from "./wallet-connect/types.js";
import type {
  WCSupportedWalletIds,
  InjectedSupportedWalletIds,
} from "./__generated__/wallet-ids.js";
import type { SmartWalletOptions } from "./smart/types.js";

// combine generic + custom ones
export type WalletId =
  | "local"
  | "embedded"
  | "smart"
  | WCSupportedWalletIds
  | InjectedSupportedWalletIds;

// connect options
export type InjectedConnectOptions = {
  extension: true;
  chain?: Chain;
};

type InjectedAutoConnectOptions = {
  extension: true;
};

// TODO
type LocalWalletConnectOptions = {
  // chain?: Chain
  todo: true;
};

type LocalWalletAutoConnectOptions = {
  todo: true;
};

// TODO
type EmbeddedWalletConnectOptions = {
  chain?: Chain;
  todo: true;
};

type EmbeddedWalletAutoConnectOptions = {
  todo: true;
};

type SmartWalletConnectOpions = {
  smart_todo: true;
};

// wallet.connect types
export type WalletConnectionOption<T extends WalletId> = T extends "smart"
  ? SmartWalletConnectOpions
  : T extends "local"
    ? // locale wallet
      LocalWalletConnectOptions
    : // embedded wallet
      T extends "embedded"
      ? EmbeddedWalletConnectOptions
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
  ? SmartWalletConnectOpions
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

type SmartWalletCreationOptions = SmartWalletOptions;

type EmbeddedWalletCreationOptions = {
  embedded_todo_creation: true;
};

export type WalletCreationOptions<T extends WalletId> = T extends "smart"
  ? SmartWalletCreationOptions
  : T extends "embedded"
    ? EmbeddedWalletCreationOptions
    : undefined;

// generic args for createWallet(...args) or new Wallet(...args)
export type CreateWalletArgs<T extends WalletId> =
  WalletCreationOptions<T> extends undefined
    ? [T]
    : [T, WalletCreationOptions<T>];
