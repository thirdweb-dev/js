import { WalletConnect } from "@thirdweb-dev/wallets";
import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import { TW_WC_PROJECT_ID } from "../../constants/wc";
import type { WC2_QRModalOptions } from "@thirdweb-dev/wallets";
import { WalletConnectScan } from "./WalletConnectScan";
import { HeadlessConnectUI } from "../headlessConnectUI";
import { isMobile } from "../../../evm/utils/isMobile";

/**
 * @wallet
 */
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
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
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
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * walletConnect({
 *   projectId: "your_project_id",
 *   qrModal: "custom", // or "walletConnect"
 *   qrModalOptions: {
 *     themeMode: "dark",
 *   },
 *   recommended: true,
 * });
 * ```
 *
 * @param config -
 * Optional configuration options for the wallet
 *
 * ### projectId (optional)
 * When connecting Trust using the QR Code - Wallet Connect connector is used which requires a project id.
 * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
 *
 * ### qrModal (optional)
 * Specify wheher a custom QR Modal or the Official WalletConnect Modal should be used on desktop. The custom screen has an option to open the official WalletConnect Modal too.
 *
 * Note that the official WalletConnect Modal is always used on mobile devices.
 *
 * The default is `"custom"` ( for desktop )
 *
 * ### qrModalOptions (optional)
 * The [WalletConnect Modal options](https://docs.walletconnect.com/advanced/walletconnectmodal/options) to customize the official WalletConnect Modal.
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
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
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMxQzdERkMiLz4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8xXzQ2KSIvPgo8cGF0aCBkPSJNMjYuNDIyNyAzMS40NzMxQzMzLjkxNzEgMjQuMTc1NiA0Ni4wODI5IDI0LjE3NTYgNTMuNTc3MyAzMS40NzMxTDU0LjQ3OTYgMzIuMzU4QzU0Ljg1OCAzMi43MjA3IDU0Ljg1OCAzMy4zMTU1IDU0LjQ3OTYgMzMuNjc4Mkw1MS4zOTQ1IDM2LjY4MTNDNTEuMjA1MyAzNi44Njk5IDUwLjg5OTcgMzYuODY5OSA1MC43MTA1IDM2LjY4MTNMNDkuNDczNiAzNS40NzcyQzQ0LjIzNDcgMzAuMzg1IDM1Ljc2NTMgMzAuMzg1IDMwLjUyNjQgMzUuNDc3MkwyOS4yMDIxIDM2Ljc2ODRDMjkuMDEzIDM2Ljk1NyAyOC43MDc0IDM2Ljk1NyAyOC41MTgyIDM2Ljc2ODRMMjUuNDMzMSAzMy43NjUzQzI1LjA1NDcgMzMuNDAyNiAyNS4wNTQ3IDMyLjgwNzggMjUuNDMzMSAzMi40NDUxTDI2LjQyMjcgMzEuNDczMVpNNTkuOTY1OCAzNy42ODI0TDYyLjcxNjIgNDAuMzUxOEM2My4wOTQ2IDQwLjcxNDUgNjMuMDk0NiA0MS4zMDkzIDYyLjcxNjIgNDEuNjcyTDUwLjMzMjIgNTMuNzI4QzQ5Ljk1MzggNTQuMDkwNyA0OS4zNDI2IDU0LjA5MDcgNDguOTc4OCA1My43MjhMNDAuMTg5MiA0NS4xNjg0QzQwLjEwMTkgNDUuMDgxMyAzOS45NDE4IDQ1LjA4MTMgMzkuODU0NSA0NS4xNjg0TDMxLjA2NDkgNTMuNzI4QzMwLjY4NjUgNTQuMDkwNyAzMC4wNzUzIDU0LjA5MDcgMjkuNzExNSA1My43MjhMMTcuMjgzOCA0MS42NzJDMTYuOTA1NCA0MS4zMDkzIDE2LjkwNTQgNDAuNzE0NSAxNy4yODM4IDQwLjM1MThMMjAuMDM0MiAzNy42ODI0QzIwLjQxMjUgMzcuMzE5NyAyMS4wMjM3IDM3LjMxOTcgMjEuMzg3NSAzNy42ODI0TDMwLjE3NzIgNDYuMjQyQzMwLjI2NDUgNDYuMzI5IDMwLjQyNDUgNDYuMzI5IDMwLjUxMTkgNDYuMjQyTDM5LjMwMTUgMzcuNjgyNEMzOS42Nzk5IDM3LjMxOTcgNDAuMjkxIDM3LjMxOTcgNDAuNjU0OSAzNy42ODI0TDQ5LjQ0NDUgNDYuMjQyQzQ5LjUzMTggNDYuMzI5IDQ5LjY5MTkgNDYuMzI5IDQ5Ljc3OTIgNDYuMjQyTDU4LjU2ODggMzcuNjgyNEM1OC45NzYzIDM3LjMxOTcgNTkuNTg3NSAzNy4zMTk3IDU5Ljk2NTggMzcuNjgyNFoiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMV80NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDI0Nzk1NSA0MC4wMDEyKSBzY2FsZSg4MCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNUQ5REY2Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwNkZGRiIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
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
          hideBackButton={props.supportedWallets.length === 1}
          modalSize={props.modalSize}
          createWalletInstance={props.createWalletInstance}
          setConnectedWallet={props.setConnectedWallet}
          setConnectionStatus={props.setConnectionStatus}
          hide={props.hide}
          show={props.show}
        />
      );
    },
  };
};
