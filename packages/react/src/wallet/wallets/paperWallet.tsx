import { PaperWallet } from "@thirdweb-dev/wallets";
import type { ConfiguredWallet, WalletOptions } from "@thirdweb-dev/react-core";

type PaperConfig = { clientId: string };

export const paperWallet = (config: PaperConfig) => {
  const configuredWallet = {
    id: PaperWallet.id,
    meta: PaperWallet.meta,
    create: (options: WalletOptions) =>
      new PaperWallet({ ...options, ...config }),
    config,
  } satisfies ConfiguredWallet<PaperWallet, PaperConfig>;

  return configuredWallet;
};
