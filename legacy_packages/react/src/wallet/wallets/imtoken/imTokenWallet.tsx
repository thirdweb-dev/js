import type {
  WalletOptions,
  WalletConfig,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import { ImTokenWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { ExtensionOrWCConnectionUI } from "../_common/ExtensionORWCConnectionUI";

const imTokenWalletUris = {
  ios: "imtokenv2://",
  android: "imtokenv2://",
};

export type ImTokenWalletConfigOptions = {
  projectId?: string;
  recommended?: boolean;
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
        qrcode: false,
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
