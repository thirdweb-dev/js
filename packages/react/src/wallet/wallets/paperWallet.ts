import { PaperWallet } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";

export const paperWallet = (config: { clientId: string }) => {
  return {
    id: PaperWallet.id,
    meta: PaperWallet.meta,
    create: (options: WalletOptions) =>
      new PaperWallet({ ...options, ...config }),
  } satisfies Wallet;
};
