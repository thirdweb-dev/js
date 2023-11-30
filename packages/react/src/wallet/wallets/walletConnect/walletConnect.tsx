import { WalletConnect } from "@thirdweb-dev/wallets";
import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { TW_WC_PROJECT_ID } from "../../constants/wc";
import type { WC2_QRModalOptions } from "@thirdweb-dev/wallets";
import { WalletConnectScan } from "./WalletConnectScan";
import { HeadlessConnectUI } from "../headlessConnectUI";
import { isMobile } from "../../../evm/utils/isMobile";
import { walletConnectIcon } from "../../ConnectWallet/icons/dataUris";

type walletConnectConfig = {
  /**
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
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export const walletConnect = (
  config?: walletConnectConfig,
): WalletConfig<WalletConnect> => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  return {
    recommended: config?.recommended,
    id: WalletConnect.id,
    meta: {
      ...WalletConnect.meta,
      iconURL: walletConnectIcon,
    },
    create(options: WalletOptions) {
      return new WalletConnect({
        ...options,
        qrcode: isMobile() ? true : false,
        projectId,
        qrModalOptions: config?.qrModalOptions,
      });
    },
    connectUI(props) {
      if (isMobile()) {
        return <HeadlessConnectUI {...props} />;
      }

      return (
        <WalletConnectScan
          onBack={props.goBack}
          onConnected={props.connected}
          walletConfig={props.walletConfig}
          hideBackButton={props.supportedWallets.length > 1}
          modalSize={props.modalSize}
        />
      );
    },
  };
};
