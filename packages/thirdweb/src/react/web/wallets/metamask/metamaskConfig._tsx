import {
  injectedMetamaskProvider,
  metamaskMetadata,
  metamaskWallet,
} from "../../../../wallets/injected/wallets/metamask.js";
import { walletConnect } from "../../../../wallets/wallet-connect/index.js";
import type { WalletConfig } from "../../../core/types/wallets.js";
import { asyncLocalStorage } from "../../../core/utils/asyncLocalStorage.js";
import type { LocaleId } from "../../ui/types.js";
import { getInjectedWalletLocale } from "../injected/locale/getInjectedWalletLocale.js";
import type { InjectedWalletLocale } from "../injected/locale/types.js";
import { InjectedAndWCConnectUI } from "../shared/InjectedAndWCConnectUI.js";

export type MetamaskConfigOptions = {
  /**
   * This is only relevant when connecting to Metamask mobile app using QR code scanning. This uses WalletConnect protocol to connect to MetaMask.
   *
   * WalletConnect requires a `projectId` that can be obtained at https://cloud.walletconnect.com/
   *
   * If you don't pass a `projectId`, a default `projectId` will be used that is created by thirdweb.
   *
   * Refer to [WalletConnect docs](https://docs.walletconnect.com) for more info
   */
  projectId?: string;
  /**
   * If `true`, MetaMask will be shown as "recommended" to the user in [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
   * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) 's UI
   */
  recommended?: boolean;
};

/**
 * Integrate MetaMask wallet connection in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in `wallets` prop.
 * @param options - Options for configuring the MetaMask wallet.
 * Refer to [`MetamaskConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/MetamaskConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ConnectButton, metamaskConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ConnectButton
 *      client={client}
 *      wallets={[metamaskConfig()]}
 *      appMetadata={appMetadata}
 *     />
 *   );
 * }
 * ```
 * @returns `WalletConfig` object which can be added to the `wallets` prop in either `ConnectButton` or `ConnectEmbed` component.
 * @walletConfig
 */
export const metamaskConfig = (
  options?: MetamaskConfigOptions,
): WalletConfig => {
  let prefetchedLocale: InjectedWalletLocale;
  let prefetchedLocaleId: LocaleId;

  const config: WalletConfig = {
    recommended: options?.recommended,
    metadata: metamaskMetadata,
    create(createOptions) {
      if (config.isInstalled && config.isInstalled()) {
        return metamaskWallet();
      }

      return walletConnect({
        client: createOptions.client,
        appMetadata: createOptions.appMetadata,
        metadata: metamaskMetadata,
        storage: asyncLocalStorage,
      });
    },
    connectUI(props) {
      return (
        <InjectedAndWCConnectUI
          {...props}
          projectId={options?.projectId}
          links={{
            extension:
              "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
            android:
              "https://play.google.com/store/apps/details?id=io.metamask",
            ios: "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202",
          }}
          platformUris={{
            ios: "metamask://",
            android: "https://metamask.app.link/",
            other: "https://metamask.app.link/",
          }}
          prefetchedLocale={prefetchedLocale}
          prefetchedLocaleId={prefetchedLocaleId}
        />
      );
    },
    isInstalled() {
      return !!injectedMetamaskProvider();
    },
    async prefetch(localeId) {
      const localeFn = await getInjectedWalletLocale(localeId);
      prefetchedLocale = localeFn(metamaskMetadata.name);
      prefetchedLocaleId = localeId;
    },
  };

  return config;
};
