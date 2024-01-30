"use-client";

import {
  createContext,
  useCallback,
  useState,
  useMemo,
  useContext,
} from "react";
import type { Wallet } from "../../wallets/interfaces/wallet.js";

export type WalletWithId = Wallet & { _id: string };

type WalletContext = {
  activeWallet: WalletWithId | null;
  connectedWallets: WalletWithId[];
  connectWallet: (wallet: WalletWithId) => void;
  activateWallet: (wallet: WalletWithId) => void;
  disconnectWallet: (wallet: WalletWithId) => void;
};

const WalletContext = /* @__PURE__ */ createContext({} as WalletContext);

/**
 * TODO
 * @internal
 */
export function WalletProvider({ children }: React.PropsWithChildren) {
  const [walletState, setWalletState] = useState<{
    activeWalletId: string | null;
    walletRecord: Map<string, WalletWithId>;
    walletIds: Set<string>;
  }>({
    activeWalletId: null,
    walletRecord: new Map(),
    walletIds: new Set(),
  });

  const activateWallet = useCallback((wallet: WalletWithId) => {
    setWalletState((prev) => ({ ...prev, activeWalletId: wallet._id }));
  }, []);

  const connectWallet = useCallback((wallet: WalletWithId) => {
    setWalletState((prev) => {
      return {
        ...prev,
        walletRecord: prev.walletRecord.set(wallet._id, wallet),
        walletIds: prev.walletIds.add(wallet._id),
        activeWalletId: wallet._id,
      };
    });
  }, []);

  const disconnectWallet = useCallback((wallet: WalletWithId) => {
    setWalletState((prev) => {
      const walletRecord = new Map(prev.walletRecord);
      walletRecord.delete(wallet._id);
      const walletIds = new Set(prev.walletIds);
      walletIds.delete(wallet._id);
      const nextWalletId = [...walletIds][0] || null;
      return {
        ...prev,
        walletRecord,
        walletIds,
        activeWalletId: nextWalletId,
      };
    });
  }, []);

  const activeWallet = useMemo(() => {
    const { activeWalletId, walletRecord } = walletState;
    return activeWalletId ? walletRecord.get(activeWalletId) || null : null;
  }, [walletState]);

  const connectedWallets = useMemo(() => {
    const { walletIds, walletRecord } = walletState;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [...walletIds].map((id) => walletRecord.get(id)!);
  }, [walletState]);

  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        activateWallet,
        disconnectWallet,
        activeWallet,
        connectedWallets,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

//hooks

/**
 * A hook that returns the active wallet.
 * @returns The active wallet or null if no active wallet.
 * @example
 * ```jsx
 * import { useActiveWallet } from "thirdweb/react";
 *
 * const activeWallet = useActiveWallet();
 * ```
 */
export function useActiveWallet() {
  return useContext(WalletContext).activeWallet;
}

/**
 * A hook that returns the active wallet address.
 * @returns The active wallet address or null if no active wallet.
 * @example
 * ```jsx
 * import { useActiveWalletAddress } from "thirdweb/react";
 *
 * const activeWalletAddress = useActiveWalletAddress();
 * ```
 */
export function useActiveWalletAddress() {
  const activeWallet = useActiveWallet();
  return activeWallet?.address || null;
}

/**
 * A hook that returns all connected wallets.
 * @returns An array of all connected wallets.
 * @example
 * ```jsx
 * import { useConnectedWallets } from "thirdweb/react";
 *
 * const activeWalletChainId = useConnectedWallets();
 * ```
 */
export function useConnectedWallets() {
  return useContext(WalletContext).connectedWallets;
}

/**
 * A hook that lets you set the active wallet.
 * @returns A function that lets you set the active wallet.
 * @example
 * ```jsx
 * import { useSetActiveWallet } from "thirdweb/react";
 *
 * const setAciveWallet = useSetActiveWallet();
 *
 * // later in your code
 * setAciveWallet(wallet);
 * ```
 */
export function useSetActiveWallet() {
  const { activateWallet } = useContext(WalletContext);
  return activateWallet;
}

/**
 * A hook that lets you connect a wallet.
 * @returns A function that lets you connect a wallet.
 * @example
 * ```jsx
 * import { useConnect } from "thirdweb/react";
 * import { metamaskWallet } from "thirdweb/wallets/metamask";
 *
 * const { connect, isConnecting, error } = useConnect();
 *
 * // later in your code
 *
 * const wallet = await connect(() => {
 *  return metamaskWallet.connect();
 * });
 * ```
 */
export function useConnect() {
  const { connectWallet } = useContext(WalletContext);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(
    async function (options: Wallet | (() => Promise<Wallet>)) {
      // reset error state
      setError(null);
      if (typeof options !== "function") {
        const walletWithId = options as WalletWithId;
        walletWithId._id = fakeUuid();
        connectWallet(walletWithId);
        return walletWithId as Wallet;
      }

      setIsConnecting(true);
      try {
        const wallet = await options();
        // add the uuid for this wallet
        const walletWithId = wallet as WalletWithId;
        walletWithId._id = fakeUuid();
        connectWallet(walletWithId);
        return walletWithId as Wallet;
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsConnecting(false);
      }
      return null;
    },
    [connectWallet],
  );

  return { connect, isConnecting, error } as const;
}

// helpers //

// TODO replace with more realiable uuid generator
/**
 *
 * @internal
 */
function fakeUuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
