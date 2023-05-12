import { WalletConnect } from "@thirdweb-dev/wallets";
import type { ConfiguredWallet, WalletOptions } from "@thirdweb-dev/react-core";
import { TW_WC_PROJECT_ID } from "../constants/wc";

type walletConnectConfig = { projectId?: string };

export const walletConnect = (
  config?: walletConnectConfig,
): ConfiguredWallet<WalletConnect, walletConnectConfig> => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  return {
    id: WalletConnect.id,
    meta: WalletConnect.meta,
    create(options: WalletOptions) {
      return new WalletConnect({ ...options, qrcode: true, projectId });
    },
    config: {
      projectId,
    },
  };
};
