// different file (handwritten - not generated) ---------------

import type { Chain } from "../../chains/types.js";
import type {
  WCConnectOptions,
  WCAutoConnectOptions,
} from "../wallet-connect/types.js";
import type {
  WCSupportedWalletIds,
  InjectedSupportedWalletIds,
} from "./wallet-ids.js";

// combine generic + custom ones
export type WalletId =
  | "local"
  | "embedded"
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

// get wallet.connect options
// check wallet type of wallet it is and assign options type
export type WalletConnectionOption<T extends WalletId> = T extends "local"
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

// get wallet.connect options
// check wallet type of wallet it is and assign options type
export type WalletAutoConnectionOption<T extends WalletId> = T extends "local"
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

// get wallet.connect options
// check wallet type of wallet it is and assign options type
export type WalletCreationOptions<T extends WalletId> = T extends "embedded"
  ? { todo: true }
  : never;

export type CreateWalletArgs<T extends WalletId> =
  WalletCreationOptions<T> extends undefined
    ? [T]
    : [T, WalletCreationOptions<T>];
