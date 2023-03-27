import { TW_WC_PROJECT_ID } from "@thirdweb-dev/react-core";
import { WalletConnect } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";

export const walletConnect = (config?: { projectId?: string }) => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  return {
    id: WalletConnect.id,
    meta: WalletConnect.meta,
    create: (options: WalletOptions) =>
      new WalletConnect({ ...options, qrcode: true, projectId }),
  } satisfies Wallet;
};
