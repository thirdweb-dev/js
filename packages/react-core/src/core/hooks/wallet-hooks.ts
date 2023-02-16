import { useThirdwebWallet } from "../providers/thirdweb-wallet-provider";

export function useActiveWallet() {
  return useThirdwebWallet().activeWallet;
}

export function useWallets() {
  return useThirdwebWallet().wallets;
}

export function useConnect() {
  return useThirdwebWallet().connect;
}
