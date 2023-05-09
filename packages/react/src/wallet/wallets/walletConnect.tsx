import { WalletConnect } from "@thirdweb-dev/wallets";
import type { ConfiguredWallet, WalletOptions } from "@thirdweb-dev/react-core";
import { TW_WC_PROJECT_ID } from "../constants/wc";

type walletConnectConfig = { projectId?: string };

export const walletConnect = (config?: walletConnectConfig) => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  const configuredWallet = {
    id: WalletConnect.id,
    meta: {
      name: "WalletConnect",
      iconURL:
        "ipfs://QmX58KPRaTC9JYZ7KriuBzeoEaV2P9eZcA3qbFnTHZazKw/wallet-connect.svg",
    },
    create: (options: WalletOptions) =>
      new WalletConnect({ ...options, qrcode: true, projectId }),
    config: {
      projectId,
    },
  } satisfies ConfiguredWallet<WalletConnect, walletConnectConfig>;

  return configuredWallet;
};
