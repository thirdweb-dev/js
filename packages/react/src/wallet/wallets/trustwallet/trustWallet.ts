import { WalletConnect } from "@thirdweb-dev/wallets";
import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import type { WC2_QRModalOptions } from "@thirdweb-dev/wallets";
import { TW_WC_PROJECT_ID } from "../../constants/wc";

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

export const trustWallet = (
  config?: walletConnectConfig,
): WalletConfig<WalletConnect> => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  return {
    id: "trust",
    meta: {
      iconURL:
        "https://registry.walletconnect.org/v2/logo/md/0528ee7e-16d1-4089-21e3-bbfb41933100",
      name: "Trust Wallet",
    },
    create(options: WalletOptions) {
      return new WalletConnect({
        ...options,
        qrcode: true,
        projectId,
        qrModalOptions: config?.qrModalOptions,
      });
    },
  };
};
