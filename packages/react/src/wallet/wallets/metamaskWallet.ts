import type { WalletOptions, Wallet } from "@thirdweb-dev/react-core";
import { MetaMask } from "@thirdweb-dev/wallets";

export const metamaskWallet = () => {
  return {
    id: MetaMask.id,
    meta: MetaMask.meta,
    create: (options: WalletOptions) => new MetaMask({ ...options }),
  } satisfies Wallet;
};
