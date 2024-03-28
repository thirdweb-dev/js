import type {
  WalletOptions,
  WalletConfig,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import {
  RainbowWallet,
  getInjectedRainbowProvider,
} from "@thirdweb-dev/wallets";
import { handelWCSessionRequest } from "../handleWCSessionRequest";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { ExtensionOrWCConnectionUI } from "../_common/ExtensionORWCConnectionUI";

const rainbowWalletUris = {
  ios: "rainbow://",
  android: "https://rnbwapp.com/",
  other: "https://rnbwapp.com/",
};

/**
 * @wallet
 */
export type RainbowWalletConfigOptions = {
  /**
   * When connecting Rainbow using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

/**
 * A wallet configurator for [Rainbow Wallet](https://rainbow.me/en/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * rainbowWallet({
 *  projectId: 'YOUR_PROJECT_ID',
 *  recommended: true,
 * })
 * ```
 *
 * @param options -
 * Optional configuration options for the wallet
 *
 * ### projectId (optional)
 * When connecting Core using the QR Code - Wallet Connect connector is used which requires a project id.
 * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export const rainbowWallet = (
  options?: RainbowWalletConfigOptions,
): WalletConfig<RainbowWallet> => {
  return {
    id: RainbowWallet.id,
    recommended: options?.recommended,
    meta: {
      ...RainbowWallet.meta,
      name: "Rainbow",
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzVfMTQ5KSI+CjxwYXRoIGQ9Ik04MCAwSDBWODBIODBWMFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl81XzE0OSkiLz4KPHBhdGggZD0iTTEzLjMzMzMgMjUuMzMzNEgxNy4zMzMzQzM3Ljk1MTkgMjUuMzMzNCA1NC42NjY2IDQyLjA0ODEgNTQuNjY2NiA2Mi42NjY3VjY2LjY2NjdINjIuNjY2NkM2NC44NzU4IDY2LjY2NjcgNjYuNjY2NiA2NC44NzU4IDY2LjY2NjYgNjIuNjY2N0M2Ni42NjY2IDM1LjQyMDYgNDQuNTc5NCAxMy4zMzM0IDE3LjMzMzMgMTMuMzMzNEMxNS4xMjQyIDEzLjMzMzQgMTMuMzMzMyAxNS4xMjQyIDEzLjMzMzMgMTcuMzMzNFYyNS4zMzM0WiIgZmlsbD0idXJsKCNwYWludDFfcmFkaWFsXzVfMTQ5KSIvPgo8cGF0aCBkPSJNNTYgNjIuNjY2Nkg2Ni42NjY3QzY2LjY2NjcgNjQuODc1OCA2NC44NzU4IDY2LjY2NjYgNjIuNjY2NyA2Ni42NjY2SDU2VjYyLjY2NjZaIiBmaWxsPSJ1cmwoI3BhaW50Ml9saW5lYXJfNV8xNDkpIi8+CjxwYXRoIGQ9Ik0xNy4zMzMzIDEzLjMzMzRWMjRIMTMuMzMzM1YxNy4zMzM0QzEzLjMzMzMgMTUuMTI0MiAxNS4xMjQyIDEzLjMzMzQgMTcuMzMzMyAxMy4zMzM0WiIgZmlsbD0idXJsKCNwYWludDNfbGluZWFyXzVfMTQ5KSIvPgo8cGF0aCBkPSJNMTMuMzMzMyAyNEgxNy4zMzMzQzM4LjY4ODMgMjQgNTYgNDEuMzExNyA1NiA2Mi42NjY3VjY2LjY2NjdINDRWNjIuNjY2N0M0NCA0Ny45MzkxIDMyLjA2MDkgMzYgMTcuMzMzMyAzNkgxMy4zMzMzVjI0WiIgZmlsbD0idXJsKCNwYWludDRfcmFkaWFsXzVfMTQ5KSIvPgo8cGF0aCBkPSJNNDUuMzMzMyA2Mi42NjY2SDU2VjY2LjY2NjZINDUuMzMzM1Y2Mi42NjY2WiIgZmlsbD0idXJsKCNwYWludDVfbGluZWFyXzVfMTQ5KSIvPgo8cGF0aCBkPSJNMTMuMzMzMyAzNC42NjY3VjI0SDE3LjMzMzNWMzQuNjY2N0gxMy4zMzMzWiIgZmlsbD0idXJsKCNwYWludDZfbGluZWFyXzVfMTQ5KSIvPgo8cGF0aCBkPSJNMTMuMzMzMyA0MS4zMzMzQzEzLjMzMzMgNDMuNTQyNCAxNS4xMjQyIDQ1LjMzMzMgMTcuMzMzMyA0NS4zMzMzQzI2LjkwNjIgNDUuMzMzMyAzNC42NjY2IDUzLjA5MzcgMzQuNjY2NiA2Mi42NjY2QzM0LjY2NjYgNjQuODc1OCAzNi40NTc1IDY2LjY2NjYgMzguNjY2NiA2Ni42NjY2SDQ1LjMzMzNWNjIuNjY2NkM0NS4zMzMzIDQ3LjIwMjYgMzIuNzk3MyAzNC42NjY2IDE3LjMzMzMgMzQuNjY2NkgxMy4zMzMzVjQxLjMzMzNaIiBmaWxsPSJ1cmwoI3BhaW50N19yYWRpYWxfNV8xNDkpIi8+CjxwYXRoIGQ9Ik0zNC42NjY3IDYyLjY2NjZINDUuMzMzNFY2Ni42NjY2SDM4LjY2NjdDMzYuNDU3NiA2Ni42NjY2IDM0LjY2NjcgNjQuODc1OCAzNC42NjY3IDYyLjY2NjZaIiBmaWxsPSJ1cmwoI3BhaW50OF9yYWRpYWxfNV8xNDkpIi8+CjxwYXRoIGQ9Ik0xNy4zMzMzIDQ1LjMzMzNDMTUuMTI0MiA0NS4zMzMzIDEzLjMzMzMgNDMuNTQyNCAxMy4zMzMzIDQxLjMzMzNWMzQuNjY2NkgxNy4zMzMzVjQ1LjMzMzNaIiBmaWxsPSJ1cmwoI3BhaW50OV9yYWRpYWxfNV8xNDkpIi8+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl81XzE0OSIgeDE9IjQwIiB5MT0iMCIgeDI9IjQwIiB5Mj0iODAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzE3NDI5OSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDFFNTkiLz4KPC9saW5lYXJHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDFfcmFkaWFsXzVfMTQ5IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDE3LjMzMzMgNjIuNjY2Nykgcm90YXRlKC05MCkgc2NhbGUoNDkuMzMzMykiPgo8c3RvcCBvZmZzZXQ9IjAuNzcwMjc3IiBzdG9wLWNvbG9yPSIjRkY0MDAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzg3NTRDOSIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Ml9saW5lYXJfNV8xNDkiIHgxPSI1NS4zMzMzIiB5MT0iNjQuNjY2NiIgeDI9IjY2LjY2NjciIHkyPSI2NC42NjY2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjQwMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjODc1NEM5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQzX2xpbmVhcl81XzE0OSIgeDE9IjE1LjMzMzMiIHkxPSIxMy4zMzM0IiB4Mj0iMTUuMzMzMyIgeTI9IjI0LjY2NjciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzg3NTRDOSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjQwMDAiLz4KPC9saW5lYXJHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDRfcmFkaWFsXzVfMTQ5IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDE3LjMzMzMgNjIuNjY2Nykgcm90YXRlKC05MCkgc2NhbGUoMzguNjY2NykiPgo8c3RvcCBvZmZzZXQ9IjAuNzIzOTI5IiBzdG9wLWNvbG9yPSIjRkZGNzAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTkwMSIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50NV9saW5lYXJfNV8xNDkiIHgxPSI0NS4zMzMzIiB5MT0iNjQuNjY2NiIgeDI9IjU2IiB5Mj0iNjQuNjY2NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZGNzAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTkwMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Nl9saW5lYXJfNV8xNDkiIHgxPSIxNS4zMzMzIiB5MT0iMzQuNjY2NyIgeDI9IjE1LjMzMzMiIHkyPSIyNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZGNzAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTkwMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50N19yYWRpYWxfNV8xNDkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcuMzMzMyA2Mi42NjY2KSByb3RhdGUoLTkwKSBzY2FsZSgyOCkiPgo8c3RvcCBvZmZzZXQ9IjAuNTk1MTMiIHN0b3AtY29sb3I9IiMwMEFBRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDFEQTQwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ4X3JhZGlhbF81XzE0OSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzNCA2NC42NjY2KSBzY2FsZSgxMS4zMzMzIDMwLjIyMjIpIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzAwQUFGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMURBNDAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDlfcmFkaWFsXzVfMTQ5IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDE1LjMzMzMgNDYpIHJvdGF0ZSgtOTApIHNjYWxlKDExLjMzMzMgMjE0LjkxMykiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBBQUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAxREE0MCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzVfMTQ5Ij4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new RainbowWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      handelWCSessionRequest(wallet, rainbowWalletUris);

      return wallet;
    },
    connectUI: ConnectUI,
    isInstalled: isInstalled,
  };
};

function isInstalled() {
  return !!getInjectedRainbowProvider();
}

function ConnectUI(props: ConnectUIProps<RainbowWallet>) {
  const locale = useTWLocale();
  return (
    <ExtensionOrWCConnectionUI
      connect={props.connect}
      connected={props.connected}
      createWalletInstance={props.createWalletInstance}
      goBack={props.goBack}
      meta={props.walletConfig["meta"]}
      setConnectedWallet={(w) => props.setConnectedWallet(w as RainbowWallet)}
      setConnectionStatus={props.setConnectionStatus}
      supportedWallets={props.supportedWallets}
      walletConnectUris={rainbowWalletUris}
      walletLocale={locale.wallets.rainbowWallet}
      isInstalled={isInstalled}
    />
  );
}
