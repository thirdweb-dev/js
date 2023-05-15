import { WalletConnect } from "@thirdweb-dev/wallets";
import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import type { WC2_QRModalOptions } from "@thirdweb-dev/wallets";

type walletConnectConfig = {
  /**cloud.walletconnect.com.
   * Your project’s unique identifier that can be obtained at https://cloud.walletconnect.com/
   *
   * Enables following functionalities within Web3Modal: wallet and chain logos, optional WalletConnect RPC, support for all wallets from our Explorer and WalletConnect v2 support. Defaults to undefined.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;
  /**
   * options to customize QR Modal.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options
   */
  qrModalOptions?: WC2_QRModalOptions;
};

export const walletConnect = (
  config?: walletConnectConfig,
): WalletConfig<WalletConnect, walletConnectConfig> => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  return {
    id: WalletConnect.id,
    meta: WalletConnect.meta,
    create(options: WalletOptions) {
      return new WalletConnect({
        ...options,
        qrcode: true,
        projectId,
        qrModalOptions: config?.qrModalOptions,
      });
    },
    config: {
      projectId,
      qrModalOptions: config?.qrModalOptions,
    },
  };
};
