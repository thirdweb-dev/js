import { SupportedWallet, WalletMeta } from "../types/wallet";
import React, { PropsWithChildren, createContext, useContext } from "react";
import invariant from "tiny-invariant";

export interface ThirdwebWalletsContext {
  supportedWallets: SupportedWallet[];
  activeWalletMeta?: WalletMeta;
  setActiveWalletMeta: (walletMeta: WalletMeta | undefined) => void;
}

const WalletsContext = createContext<ThirdwebWalletsContext | undefined>(
  undefined,
);

export const WalletsProvider: React.FC<
  PropsWithChildren<{ value?: ThirdwebWalletsContext }>
> = ({ value, children }) => {
  return (
    <WalletsContext.Provider value={value}>{children}</WalletsContext.Provider>
  );
};

export function useWalletsContext() {
  const context = useContext(WalletsContext);
  invariant(context, "useWalletsContext must be used within a WalletsProvider");
  return context;
}

export function useActiveWalletMeta() {
  const context = useContext(WalletsContext);
  invariant(
    context,
    "useActiveWalletMeta must be used within a WalletsProvider",
  );
  return context.activeWalletMeta;
}

export function useSupportedWallets() {
  const context = useContext(WalletsContext);
  invariant(
    context,
    "useSupportedWallets must be used within a WalletsProvider",
  );
  return context.supportedWallets;
}
