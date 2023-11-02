import { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { WalletConnect } from "./WalletConnect";
import { WalletConnectUI } from "./WalletConnectUI";
import { TW_WC_PROJECT_ID } from "../../../constants/walletConnect";
import { walletIds } from "@thirdweb-dev/wallets";

export type WalletConnectConfig = {
  projectId?: string;
  recommended?: boolean;
};

export const walletConnect = (
  config?: WalletConnectConfig,
): WalletConfig<WalletConnect> => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  return {
    id: WalletConnect.id,
    meta: WalletConnect.meta,
    create: (options: WalletOptions) =>
      new WalletConnect({
        ...options,
        walletId: walletIds.walletConnect,
        projectId,
      }),
    connectUI(props) {
      return <WalletConnectUI {...props} projectId={projectId} />;
    },
    recommended: config?.recommended,
  };
};
