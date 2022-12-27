import { FundWalletOptions } from "@thirdweb-dev/pay";
import {
  CoinbaseWallet,
  InjectedWallet,
  MagicAuthWallet,
  MetaMask,
  WalletConnect,
} from "@thirdweb-dev/wallets";
import { BigNumber } from "ethers";

declare global {
  interface Window {
    bridge: TWBridge;
  }
}

export const w = window as any;

export const API_KEY =
  "339d65590ba0fa79e4c8be0af33d64eda709e13652acb02c6be63f5a1fbef9c3";
export const SEPARATOR = "/";
export const SUB_SEPARATOR = "#";

// big number transform
export const bigNumberReplacer = (_key: string, value: any) => {
  // if we find a BigNumber then make it into a string (since that is safe)
  if (
    BigNumber.isBigNumber(value) ||
    (typeof value === "object" &&
      value !== null &&
      value.type === "BigNumber" &&
      "hex" in value)
  ) {
    return BigNumber.from(value).toString();
  }
  return value;
};

export const WALLETS = [
  MetaMask,
  InjectedWallet,
  WalletConnect,
  CoinbaseWallet,
  MagicAuthWallet,
] as const;

export type PossibleWallet = typeof WALLETS[number]["id"] | (string & {});

export type FundWalletInput = FundWalletOptions & {
  appId: string;
};

export interface TWBridge {
  initialize: (chain: string, options: string) => void;
  connect: (wallet: PossibleWallet, chainId?: number) => Promise<string>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  invoke: (route: string, payload: string) => Promise<string | undefined>;
  fundWallet: (options: string) => Promise<void>;
}
