import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import type { WalletOptions } from "@thirdweb-dev/react-core";
import { MagicConnectUI } from "./MagicConnectUI";
import { MagicLinkWallet } from "./types";

export const magicLink = (config: MagicLinkAdditionalOptions) => {
  const configuredWallet = {
    id: MagicLink.id,
    meta: MagicLink.meta,
    create: (options: WalletOptions) =>
      new MagicLink({ ...options, ...config }),
    config,
    connectUI(props) {
      return <MagicConnectUI {...props} magicWallet={configuredWallet} />;
    },
    isInstalled() {
      return false;
    },
  } satisfies MagicLinkWallet;

  return configuredWallet;
};
