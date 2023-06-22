import { assertWindowEthereum } from "@thirdweb-dev/wallets";

export function useInstalledWallets() {
  let isMetamaskInstalled = false;
  let isCoinbaseWalletInstalled = false;
  let isZerionWalletInstalled = false;

  if (assertWindowEthereum(globalThis.window)) {
    isMetamaskInstalled = Boolean(globalThis.window.ethereum?.isMetaMask);
    isCoinbaseWalletInstalled = Boolean(
      globalThis.window.ethereum?.isCoinbaseWallet ||
        globalThis.window.ethereum?.providers?.some((p) => p.isCoinbaseWallet),
    );
    isZerionWalletInstalled = Boolean(globalThis.window.ethereum?.isZerion);
  }

  const installedWallets = {
    metamask: isMetamaskInstalled,
    coinbaseWallet: isCoinbaseWalletInstalled,
    zerionWallet: isZerionWalletInstalled,
  };

  return installedWallets;
}
