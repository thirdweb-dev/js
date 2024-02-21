import type { Chain } from "../../chains/types.js";
import type { Ethereum } from "../interfaces/ethereum.js";
import type { WalletMetadata } from "../types.js";

export type WalletRDNS =
  | "io.metamask"
  | "com.coinbase.wallet"
  | "io.zerion.wallet"
  | "me.rainbow"
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export type InjectedWalletOptions = {
  /**
   * If the wallet supports EIP-6963, simply specify the RDNS of the wallet provider.
   * Specify the wallet ID ( RDNS ) to use.
   */
  walletId?: WalletRDNS;

  /**
   * If the wallet does not support EIP-6963, pass a function to get the injected provider.
   * By Default, it will use `() => window.ethereum`.
   */
  getProvider?: () => Ethereum | undefined;

  metadata?: WalletMetadata;
};

export type SpecificInjectedWalletOptions = Omit<
  InjectedWalletOptions,
  "walletId"
>;

export type InjectedWalletConnectOptions = { chain?: Chain };
