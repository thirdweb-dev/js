import { useDeviceWalletStorage } from "./useDeviceWalletStorage";
import { SupportedWallet } from "@thirdweb-dev/react-core";
import { assertWindowEthereum } from "@thirdweb-dev/wallets";

export function useInstalledWallets() {
  const deviceWalletStorage = useDeviceWalletStorage();

  let isMetamaskInstalled = false;
  let isCoinbaseWalletInstalled = false;

  if (assertWindowEthereum(window)) {
    isMetamaskInstalled = window.ethereum?.isMetaMask;
    isCoinbaseWalletInstalled =
      window.ethereum.providers?.some((p) => p.isCoinbaseWallet) || false;
  }

  const installedWallets: Record<SupportedWallet["id"], boolean> = {
    metamask: !!isMetamaskInstalled,
    coinbaseWallet: !!isCoinbaseWalletInstalled,
    deviceWallet: !!deviceWalletStorage,
    walletConnect: false,
    walletConnectV1: false,
    // coinbaseWalletMobile: false,
  };

  return installedWallets;
}
