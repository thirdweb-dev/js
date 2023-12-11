import { WalletConnect } from "@thirdweb-dev/wallets";
import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { TW_WC_PROJECT_ID } from "../../constants/wc";
import type { WC2_QRModalOptions } from "@thirdweb-dev/wallets";
import { WalletConnectScan } from "./WalletConnectScan";
import { HeadlessConnectUI } from "../headlessConnectUI";
import { isMobile } from "../../../evm/utils/isMobile";
import { walletConnectIcon } from "../../ConnectWallet/icons/dataUris";

export type walletConnectConfigOptions = {
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

  /**
   * Specify wheher a custom QR Modal or the Official WalletConnect Modal should be used on desktop. The custom screen has an option to open the official WalletConnect Modal too.
   *
   * Note that the official WalletConnect Modal is always used on mobile devices.
   *
   * The default is `"custom"` ( for desktop )
   */
  qrModal?: "custom" | "walletConnect";
};

/**
 * A wallet configurator for [WalletConnect](https://walletconnect.com/) which allows integrating the wallet with React.
 *
 * It returns a `WalletConfig` object which can be used to connect the wallet to app via `ConnectWallet` component or `useConnect` hook.
 *
 * @example
 *
 * ### Usage with ConnectWallet
 *
 * To allow users to connect to this wallet using the `ConnectWallet` component, you can add it to `ThirdwebProvider`'s supportedWallets prop.
 *
 * ```tsx
 * <ThirdwebProvider supportedWallets={[walletConnect()]}>
 *  <App />
 * </ThirdwebProvider>
 * ```
 *
 * ### Usage with useConnect
 *
 * you can use the `useConnect` hook to programmatically connect to the wallet without using the `ConnectWallet` component.
 *
 * The wallet also needs to be added in `ThirdwebProvider`'s supportedWallets if you want the wallet to auto-connect on next page load.
 *
 * ```tsx
 * const walletConnectConfig = walletConnect();
 *
 * function App() {
 *   const connect = useConnect();
 *
 *   async function handleConnect() {
 *     const wallet = await connect(walletConnectConfig);
 *     console.log('connected to', wallet);
 *   }
 *
 *   return <button onClick={handleConnect}> Connect </button>;
 * }
 * ```
 */
export const walletConnect = (
  config?: walletConnectConfigOptions,
): WalletConfig<WalletConnect> => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;

  // on mobile - always use the official WalletConnect Modal
  // on desktop - use the official WalletConnect Modal if qrModal is set to "walletconnect"
  const showOfficialModal = isMobile()
    ? true
    : config?.qrModal === "walletConnect"
    ? true
    : false;

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

        qrcode: showOfficialModal,
        projectId,
        qrModalOptions: config?.qrModalOptions,
      });
    },
    connectUI(props) {
      if (showOfficialModal) {
        return <HeadlessConnectUI {...props} />;
      }

      return (
        <WalletConnectScan
          onBack={props.goBack}
          onConnected={props.connected}
          walletConfig={props.walletConfig}
          hideBackButton={props.supportedWallets.length > 1}
          modalSize={props.modalSize}
          hide={props.hide}
          show={props.show}
        />
      );
    },
  };
};
