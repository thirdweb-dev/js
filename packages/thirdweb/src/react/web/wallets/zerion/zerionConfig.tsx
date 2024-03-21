import {
  injectedZerionProvider,
  zerionWallet,
  zerionWalletMetadata,
} from "../../../../wallets/injected/wallets/zerion.js";
import { walletConnect } from "../../../../wallets/wallet-connect/index.js";
import type { WalletConfig } from "../../../core/types/wallets.js";
import { asyncLocalStorage } from "../../../core/utils/asyncLocalStorage.js";
import type { LocaleId } from "../../ui/types.js";
import { getInjectedWalletLocale } from "../injected/locale/getInjectedWalletLocale.js";
import type { InjectedWalletLocale } from "../injected/locale/types.js";
import { InjectedAndWCConnectUI } from "../shared/InjectedAndWCConnectUI.js";

export type ZerionConfigOptions = {
  /**
   * This is only relevant when connecting to Zerion wallet mobile app using QR code scanning. This uses WalletConnect protocol to connect to Zerion wallet.
   *
   * WalletConnect requires a `projectId` that can be obtained at https://cloud.walletconnect.com/
   *
   * If you don't pass a `projectId`, a default `projectId` will be used that is created by thirdweb.
   *
   * Refer to [WalletConnect docs](https://docs.walletconnect.com) for more info
   */
  projectId?: string;
  /**
   * If `true`, Zerion will be shown as "recommended" to the user in [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
   * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) 's UI
   */
  recommended?: boolean;
};

/**
 * Integrate Zerion wallet connection in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in `wallets` prop.
 * @param options - Options for configuring the Zerion wallet.
 * Refer to [`ZerionConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/ZerionConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ConnectButton, zerionConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ConnectButton
 *      client={client}
 *      wallets={[zerionConfig()]}
 *      appMetadata={appMetadata}
 *     />
 *   );
 * }
 * ```
 * @returns `WalletConfig` object which can be added to the `wallets` prop in either `ConnectButton` or `ConnectEmbed` component.
 */
export const zerionConfig = (options?: ZerionConfigOptions): WalletConfig => {
  let prefetchedLocale: InjectedWalletLocale;
  let prefetchedLocaleId: LocaleId;

  const config: WalletConfig = {
    recommended: options?.recommended,
    create(createOptions) {
      if (config.isInstalled && config.isInstalled()) {
        return zerionWallet();
      }

      return walletConnect({
        client: createOptions.client,
        appMetadata: createOptions.appMetadata,
        metadata: zerionWalletMetadata,
        storage: asyncLocalStorage,
      });
    },
    metadata: zerionWalletMetadata,
    connectUI(props) {
      return (
        <InjectedAndWCConnectUI
          {...props}
          projectId={options?.projectId}
          links={{
            extension: "https://zerion.io/extension",
            android: "https://link.zerion.io/901o6IN0jqb",
            ios: "https://link.zerion.io/a11o6IN0jqb",
          }}
          platformUris={{
            ios: "zerion://",
            android: "https://link.zerion.io/pt3gdRP0njb/",
            other: "https://link.zerion.io/pt3gdRP0njb/",
          }}
          prefetchedLocale={prefetchedLocale}
          prefetchedLocaleId={prefetchedLocaleId}
        />
      );
    },
    isInstalled() {
      return !!injectedZerionProvider();
    },
    async prefetch(localeId) {
      const localeFn = await getInjectedWalletLocale(localeId);
      prefetchedLocale = localeFn(zerionWalletMetadata.name);
      prefetchedLocaleId = localeId;
    },
  };

  return config;
};
