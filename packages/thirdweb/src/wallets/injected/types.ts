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

/**
 * Options to initialize an injected wallet.
 */
export type InjectedWalletOptions = {
  /**
   * If the wallet supports [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963), specify the `rdns` of the wallet provider.
   */
  walletId?: WalletRDNS;

  /**
   * You can specify a custom logic to get the injected `Ethereum` if the wallet does not support [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963).
   *
   * If the wallet supports [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963), you should specify the `rdns` of the wallet provider as `walletId` instead.
   */
  getProvider?: () => Ethereum | undefined;

  /**
   * When creating a wallet, it contains a `metadata` property that contains various information about the wallet such as `id`, `name`, `iconUrl`.
   * Passing a `metadata` object will override the default `metadata` property on the `Wallet` instance.
   */
  metadata?: WalletMetadata;
};

export type InjectedWalletConnectOptions = { chain?: Chain };
