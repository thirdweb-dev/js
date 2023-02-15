import { useThirdwebWalletContext } from "../providers/thirdweb-wallet-provider";

export function useActiveWallet() {
  return useThirdwebWalletContext().activeWallet;
}

export function useWallets() {
  return useThirdwebWalletContext().wallets;
}

export function useConnect() {
  return useThirdwebWalletContext().connect;
}
