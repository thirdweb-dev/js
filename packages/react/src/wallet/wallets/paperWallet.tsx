import { PaperWallet } from "@thirdweb-dev/wallets";
import type { ConfiguredWallet, WalletOptions } from "@thirdweb-dev/react-core";

type PaperConfig = { clientId: string };

export const paperWallet = (
  config: PaperConfig,
): ConfiguredWallet<PaperWallet, PaperConfig> => {
  return {
    id: PaperWallet.id,
    meta: PaperWallet.meta,
    create(options: WalletOptions) {
      return new PaperWallet({ ...options, ...config });
    },
    config,
  };
};
