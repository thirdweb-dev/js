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

  /**
   * whether to switch to `activeChain` after connecting to the wallet or just stay on the chain that wallet is already connected to
   * default - false
   * @default false
   */
  autoSwitch?: boolean;
};

export const walletConnect = (
  options?: walletConnectConfig,
): WalletConfig<WalletConnect> => {
  const projectId = options?.projectId || TW_WC_PROJECT_ID;
  return {
    id: WalletConnect.id,
    meta: WalletConnect.meta,
    create(walletOptions: WalletOptions) {
      return new WalletConnect({
        ...walletOptions,
        qrcode: true,
        projectId,
        qrModalOptions: options?.qrModalOptions,
      });
    },
    autoSwitch: options?.autoSwitch,
  };
};
