import { PaperWallet } from "@thirdweb-dev/wallets";
import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";

type PaperConfig = { clientId: string };

export const paperWallet = (
  config: PaperConfig,
): WalletConfig<PaperWallet, PaperConfig> => {
  return {
    id: PaperWallet.id,
    meta: PaperWallet.meta,
    create(options: WalletOptions) {
      return new PaperWallet({ ...options, ...config });
    },
    config,
  };
};
