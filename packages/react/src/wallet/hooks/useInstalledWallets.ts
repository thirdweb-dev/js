import {
  SupportedWallet,
  useDeviceWalletStorage,
} from "@thirdweb-dev/react-core";

export function useInstalledWallets() {
  const deviceWalletStorage = useDeviceWalletStorage();

  const isMetamaskInstalled = window.ethereum?.isMetaMask;

  const isCoinbaseWalletInstalled =
    window.ethereum?.isCoinbaseWallet ||
    (window.ethereum as any)?.providers?.some((p: any) => p.isCoinbaseWallet);

  const installedWallets: Record<SupportedWallet["id"], boolean> = {
    metamask: !!isMetamaskInstalled,
    coinbaseWallet: !!isCoinbaseWalletInstalled,
    deviceWallet: !!deviceWalletStorage,
  };

  return installedWallets;
}
