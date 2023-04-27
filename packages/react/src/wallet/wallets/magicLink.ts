import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";

export const magicLink = (config: MagicLinkAdditionalOptions) => {
  return {
    id: MagicLink.id,
    meta: MagicLink.meta,
    create: (options: WalletOptions) =>
      new MagicLink({ ...options, ...config }),
  } satisfies Wallet;
};
