import type { WalletOptions, Wallet } from "@thirdweb-dev/react-core";
import { MetaMaskWallet } from "@thirdweb-dev/wallets";

export const metamaskWallet = () => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (options: WalletOptions) =>
      new MetaMaskWallet({ ...options, qrcode: false }),
  } satisfies Wallet;
};
