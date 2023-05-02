import { PaperWallet } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";

type PaperConfig = { clientId: string };

export const paperWallet = (config: PaperConfig) => {
  return {
    id: PaperWallet.id,
    meta: PaperWallet.meta,
    create: (options: WalletOptions) =>
      new PaperWallet({ ...options, ...config }),
    config,
  } satisfies Wallet<PaperWallet, PaperConfig>;
};
