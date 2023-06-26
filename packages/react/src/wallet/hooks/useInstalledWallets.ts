import { assertWindowEthereum } from "@thirdweb-dev/wallets";

export function useInstalledWallets() {
  let isMetamaskInstalled = false;
  let isCoinbaseWalletInstalled = false;
  let isTrustWalletInstalled: boolean | undefined = false;

  if (assertWindowEthereum(globalThis.window)) {
    isMetamaskInstalled = globalThis.window.ethereum?.isMetaMask;
    isCoinbaseWalletInstalled =
      globalThis.window.ethereum?.isCoinbaseWallet ||
      globalThis.window.ethereum?.providers?.some((p) => p.isCoinbaseWallet) ||
      false;
    isTrustWalletInstalled = globalThis.window.ethereum?.isTrust;
  }

  const installedWallets = {
    metamask: !!isMetamaskInstalled,
    coinbaseWallet: !!isCoinbaseWalletInstalled,
    trustWallet: !!isTrustWalletInstalled,
  };

  return installedWallets;
}
