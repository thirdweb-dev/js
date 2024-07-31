import type {
  WalletOptions,
  WalletConfig,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import { ImTokenWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { ExtensionOrWCConnectionUI } from "../_common/ExtensionORWCConnectionUI";
import type { QRModalOptions } from "@thirdweb-dev/wallets/src/evm/connectors/wallet-connect/qrModalOptions";

const imTokenWalletUris = {
  ios: "imtokenv2://",
  android: "imtokenv2://",
};

export type ImTokenWalletConfigOptions = {
  projectId?: string;
  recommended?: boolean;

  /**
   * Specify whether to open the official Wallet Connect  Modal when connecting the wallet if no injected MetaMask provider is found when connecting the wallet.
   *
   * This should not be set if you are using ConnectWallet component and only when manually connecting the wallet using a hook like `useConnect`.
   *
   * You can set it to `true` or a configuration object to enable the Wallet Connect Modal.
   */
  wcModal?:
    | {
        /**
         * Configure the style of Wallet Connect Modal.
         */
        qrModalOptions?: QRModalOptions;
      }
    | boolean;
};

export const imTokenWallet = (
  options?: ImTokenWalletConfigOptions,
): WalletConfig<ImTokenWallet> => {
  return {
    id: ImTokenWallet.id,
    recommended: options?.recommended,
    meta: {
      ...ImTokenWallet.meta,
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new ImTokenWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: options?.wcModal ? true : false,
        qrModalOptions:
          typeof options?.wcModal === "object"
            ? options?.wcModal?.qrModalOptions
            : undefined,
      });

      return wallet;
    },
    connectUI: ConnectUI,
    isInstalled: isInstalled,
  };
};

function isInstalled() {
  if (assertWindowEthereum(globalThis.window)) {
    return !!globalThis.window.ethereum.isImToken;
  }
  return false;
}

function ConnectUI(props: ConnectUIProps<ImTokenWallet>) {
  const locale = useTWLocale();
  return (
    <ExtensionOrWCConnectionUI
      connect={props.connect}
      connected={props.connected}
      createWalletInstance={props.createWalletInstance}
      goBack={props.goBack}
      meta={props.walletConfig.meta}
      setConnectedWallet={(w) => props.setConnectedWallet(w as ImTokenWallet)}
      setConnectionStatus={props.setConnectionStatus}
      supportedWallets={props.supportedWallets}
      walletConnectUris={{
        ios: imTokenWalletUris.ios,
        android: imTokenWalletUris.android,
        other: imTokenWalletUris.android,
      }}
      walletLocale={locale.wallets.imTokenWallet}
      isInstalled={isInstalled}
    />
  );
}
