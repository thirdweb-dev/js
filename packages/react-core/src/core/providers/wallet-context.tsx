import { createContext, useContext } from "react";
import { ConnectParams, CreateAsyncStorage } from "@thirdweb-dev/wallets";
import type { WalletConfig, WalletInstance } from "../types/wallet";
import type { Chain } from "@thirdweb-dev/chains";
import type { Signer } from "ethers";

type ThirdwebWalletContextData = {
  wallets: WalletConfig[];
  signer?: Signer;
  activeWallet?: WalletInstance;
  activeWalletConfig?: WalletConfig;
  connect: <I extends WalletInstance>(...args: ConnectFnArgs<I>) => Promise<I>;
  disconnect: () => Promise<void>;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  createWalletInstance: <I extends WalletInstance>(
    Wallet: WalletConfig<I>,
  ) => I;
  createdWalletInstance?: WalletInstance;
  createWalletStorage: CreateAsyncStorage;
  switchChain: (chain: number) => Promise<void>;
  chainToConnect?: Chain;
  activeChain: Chain;
  setConnectedWallet: (
    wallet: WalletInstance,
    params?: ConnectParams<Record<string, any>>,
  ) => Promise<void>;
  /**
   * Get wallet config object from wallet instance
   */
  getWalletConfig: (walletInstance: WalletInstance) => WalletConfig | undefined;
  activeChainSetExplicitly: boolean;
  clientId?: string;
};

/**
 * @internal
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * @internal
 */
export type WalletConnectParams<I extends WalletInstance> = Parameters<
  I["connect"]
>[0];

/**
 * @internal
 */
export type ConnectionStatus =
  | "unknown"
  | "connected"
  | "disconnected"
  | "connecting";

/**
 * @internal
 */
export type ConnectFnArgs<I extends WalletInstance> =
  // if second argument is optional
  undefined extends WalletConnectParams<I>
    ? [
        wallet: WalletConfig<I>,
        connectParams?: NonNullable<WalletConnectParams<I>>,
      ]
    : // if second argument is required
      [
        wallet: WalletConfig<I>,
        connectParams: NonNullable<WalletConnectParams<I>>,
      ];

/**
 * @internal
 */
export const ThirdwebWalletContext = /* @__PURE__ */ createContext<
  ThirdwebWalletContextData | undefined
>(undefined);

export function useWalletContext() {
  const ctx = useContext(ThirdwebWalletContext);
  if (!ctx) {
    throw new Error(
      `useWalletContext() can only be used inside <ThirdwebProvider />`,
    );
  }
  return ctx;
}
