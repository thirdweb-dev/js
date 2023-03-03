import {
  SupportedWallet,
  useDeviceWalletStorage,
} from "@thirdweb-dev/react-core";

export function useInstalledWallets() {
  const deviceWalletStorage = useDeviceWalletStorage();

  const isMetamaskInstalled =
    typeof window !== "undefined" ? window.ethereum?.isMetaMask : false;

  const isCoinbaseWalletInstalled =
    typeof window !== "undefined"
      ? window.ethereum?.isCoinbaseWallet ||
        (window.ethereum as any)?.providers?.some(
          (p: any) => p.isCoinbaseWallet,
        )
      : false;

  const installedWallets: Record<SupportedWallet["id"], boolean> = {
    metamask: !!isMetamaskInstalled,
    coinbaseWallet: !!isCoinbaseWalletInstalled,
    deviceWallet: !!deviceWalletStorage,
    walletConnect: false,
    walletConnectV1: false,
    coinbaseWalletMobile: false,
  };

  return installedWallets;
}
