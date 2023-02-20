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

export function useDisconnect() {
  return useThirdwebWallet().disconnect;
}

export function useConnectingToWallet() {
  return useThirdwebWallet().connectingToWallet;
}

export function useCreateWalletInstance() {
  return useThirdwebWallet().createWalletInstance;
}

export function useSwitchChain() {
  return useThirdwebWallet().switchChain;
}

export function useActiveChainId() {
  return useThirdwebWallet().activeChainId;
}

export function useAccountAddress() {
  return useThirdwebWallet().accountAddress;
}
