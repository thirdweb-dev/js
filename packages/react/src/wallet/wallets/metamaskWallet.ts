import type { WalletOptions, Wallet } from "@thirdweb-dev/react-core";
import { assertWindowEthereum, MetaMask } from "@thirdweb-dev/wallets";

export const metamaskWallet = () => {
  let isInjected = false;
  if (assertWindowEthereum(globalThis.window)) {
    isInjected = !!globalThis.window.ethereum?.isMetaMask;
  } else {
    isInjected = false;
  }

  return {
    id: MetaMask.id,
    meta: MetaMask.meta,
    create: (options: WalletOptions) =>
      new MetaMask({ ...options, isInjected }),
  } satisfies Wallet;
};
