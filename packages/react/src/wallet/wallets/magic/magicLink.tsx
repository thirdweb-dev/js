import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import type { WalletOptions } from "@thirdweb-dev/react-core";
import { MagicConnectUI } from "./MagicConnectUI";
import { ConfiguredMagicLinkWallet } from "./types";

export function magicLink(
  config: MagicLinkAdditionalOptions,
): ConfiguredMagicLinkWallet {
  return {
    id: MagicLink.id,
    meta: MagicLink.meta,
    create: (options: WalletOptions) =>
      new MagicLink({ ...options, ...config }),
    config,
    connectUI: MagicConnectUI,
    isInstalled() {
      return false;
    },
  };
}
