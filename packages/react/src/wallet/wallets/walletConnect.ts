import { WalletConnect } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";
import { TW_WC_PROJECT_ID } from "../constants/wc";

type walletConnectConfig = { projectId?: string };

export const walletConnect = (config?: walletConnectConfig) => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  return {
    id: WalletConnect.id,
    meta: WalletConnect.meta,
    create: (options: WalletOptions) =>
      new WalletConnect({ ...options, qrcode: true, projectId }),
    config: {
      projectId,
    },
  } satisfies Wallet<WalletConnect, walletConnectConfig>;
};
