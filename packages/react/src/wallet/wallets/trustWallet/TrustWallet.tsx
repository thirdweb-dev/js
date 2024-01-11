import type {
  WalletOptions,
  WalletConfig,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import { TrustWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { handelWCSessionRequest } from "../handleWCSessionRequest";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { ExtensionOrWCConnectionUI } from "../_common/ExtensionORWCConnectionUI";

const trustWalletUris = {
  ios: "trust://",
  android: "https://link.trustwallet.com/",
  other: "https://link.trustwallet.com/",
};

/**
 * @wallet
 */
export type TrustWalletConfigOptions = {
  /**
   * When connecting Trust using the QR Code - Wallet Connect connector is used which requires a project id.
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
 * A wallet configurator for [Trust Wallet](https://trustwallet.com/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * trustWallet({
 *  projectId: 'your_project_id',
 *  recommended: true,
 * })
 * ```
 *
 * @param config -
 * Optional configuration options for the wallet
 *
 * ### projectId (optional)
 * When connecting Trust using the QR Code - Wallet Connect connector is used which requires a project id.
 * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export const trustWallet = (
  options?: TrustWalletConfigOptions,
): WalletConfig<TrustWallet> => {
  return {
    id: TrustWallet.id,
    recommended: options?.recommended,
    meta: {
      ...TrustWallet.meta,
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00MC41MzAzIDE3LjE0MjVDNDguMjQ3NyAyMy42ODU3IDU3LjE1NiAyMy4zNTE4IDU5LjcwMDMgMjMuMzcwN0M1OC44Njk4IDYwLjI1MTMgNTQuNjgzNSA1Mi45MDU4IDQwLjE4ODcgNjMuMTQxMkMyNS44NDc0IDUyLjY5MTYgMjEuNTc5IDU5Ljk3NDQgMjEuMjk2NCAyMy4wODU1QzIzLjgxNDIgMjMuMTA0MiAzMi43MTY1IDIzLjU3MDQgNDAuNTMwMyAxNy4xNDI1WiIgc3Ryb2tlPSIjMzM3NUJCIiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new TrustWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });

      handelWCSessionRequest(wallet, trustWalletUris);

      return wallet;
    },
    connectUI: ConnectUI,
    isInstalled: isInstalled,
  };
};

function isInstalled() {
  if (assertWindowEthereum(globalThis.window)) {
    return !!globalThis.window.ethereum.isTrust;
  }
  return false;
}

function ConnectUI(props: ConnectUIProps<TrustWallet>) {
  const locale = useTWLocale();
  return (
    <ExtensionOrWCConnectionUI
      connect={props.connect}
      connected={props.connected}
      createWalletInstance={props.createWalletInstance}
      goBack={props.goBack}
      meta={props.walletConfig["meta"]}
      setConnectedWallet={(w) => props.setConnectedWallet(w as TrustWallet)}
      setConnectionStatus={props.setConnectionStatus}
      supportedWallets={props.supportedWallets}
      walletConnectUris={trustWalletUris}
      walletLocale={locale.wallets.trustWallet}
      isInstalled={isInstalled}
    />
  );
}
