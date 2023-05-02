import { walletIds } from "@thirdweb-dev/wallets";
import { createContext, useContext } from "react";
import { WalletInfo } from "../types";

export const WalletsInfoCtx = createContext<WalletInfo[]>([]);

export function useWalletInfo(
  id: keyof typeof walletIds,
  required: true,
): WalletInfo;
export function useWalletInfo(
  id: keyof typeof walletIds,
  required: false,
): WalletInfo | undefined;
export function useWalletInfo(
  id: keyof typeof walletIds,
  required: true | false,
): WalletInfo | undefined {
  const walletsInfo = useContext(WalletsInfoCtx);
  const found = walletsInfo.find((w) => w.wallet.id === id);
  if (required && !found) {
    throw new Error(`Wallet ${id} not found`);
  }
  return found;
}

export function useWalletsInfo() {
  return useContext(WalletsInfoCtx);
}
