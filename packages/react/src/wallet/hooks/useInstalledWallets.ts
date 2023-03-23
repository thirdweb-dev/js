import { useDeviceWalletStorage } from "./useDeviceWalletStorage";
import { assertWindowEthereum } from "@thirdweb-dev/wallets";

export function useInstalledWallets() {
  const deviceWalletStorage = useDeviceWalletStorage();

  let isMetamaskInstalled = false;
  let isCoinbaseWalletInstalled = false;

  if (assertWindowEthereum(globalThis.window)) {
    isMetamaskInstalled = globalThis.window.ethereum?.isMetaMask;
    isCoinbaseWalletInstalled =
      globalThis.window.ethereum?.isCoinbaseWallet ||
      globalThis.window.ethereum?.providers?.some((p) => p.isCoinbaseWallet) ||
      false;
  }

  const installedWallets = {
    metamask: !!isMetamaskInstalled,
    coinbaseWallet: !!isCoinbaseWalletInstalled,
    deviceWallet: !!deviceWalletStorage?.data,
  };

  return installedWallets;
}
