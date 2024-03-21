import {
  injectedRainbowProvider,
  rainbowWallet,
  rainbowWalletMetadata,
} from "../../../../wallets/injected/wallets/rainbow.js";
import { walletConnect } from "../../../../wallets/wallet-connect/index.js";
import type { WalletConfig } from "../../../core/types/wallets.js";
import { asyncLocalStorage } from "../../../core/utils/asyncLocalStorage.js";
import type { LocaleId } from "../../ui/types.js";
import { getInjectedWalletLocale } from "../injected/locale/getInjectedWalletLocale.js";
import type { InjectedWalletLocale } from "../injected/locale/types.js";
import { InjectedAndWCConnectUI } from "../shared/InjectedAndWCConnectUI.js";

export type RainbowConfigOptions = {
  /**
   * This is only relevant when connecting to Rainbow wallet mobile app using QR code scanning. This uses WalletConnect protocol to connect to Rainbow wallet.
   *
   * WalletConnect requires a `projectId` that can be obtained at https://cloud.walletconnect.com/
   *
   * If you don't pass a `projectId`, a default `projectId` will be used that is created by thirdweb.
   *
   * Refer to [WalletConnect docs](https://docs.walletconnect.com) for more info
   */
  projectId?: string;
  /**
   * If `true`, Rainbow will be shown as "recommended" to the user in [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
   * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) 's UI
   */
  recommended?: boolean;
};

/**
 * Integrate Rainbow wallet connection in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in `wallets` prop.
 * @param options - Options for configuring the Rainbow wallet.
 * Refer to [`RainbowConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/RainbowConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ConnectButton, rainbowConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ConnectButton
 *      client={client}
 *      wallets={[rainbowConfig()]}
 *      appMetadata={appMetadata}
 *     />
 *   );
 * }
 * ```
 * @returns `WalletConfig` object which can be added to the `wallets` prop in either `ConnectButton` or `ConnectEmbed` component.
 * @walletConfig
 */
export const rainbowConfig = (options?: RainbowConfigOptions): WalletConfig => {
  let prefetchedLocale: InjectedWalletLocale;
  let prefetchedLocaleId: LocaleId;

  const config: WalletConfig = {
    recommended: options?.recommended,
    create(createOptions) {
      if (config.isInstalled && config.isInstalled()) {
        return rainbowWallet();
      }

      return walletConnect({
        client: createOptions.client,
        appMetadata: createOptions.appMetadata,
        metadata: rainbowWalletMetadata,
        storage: asyncLocalStorage,
      });
    },
    metadata: rainbowWalletMetadata,
    connectUI(props) {
      return (
        <InjectedAndWCConnectUI
          {...props}
          projectId={options?.projectId}
          links={{
            extension:
              "https://chrome.google.com/webstore/detail/rainbow/opfgelmcmbiajamepnmloijbpoleiama",
            android: "https://rnbwapp.com/e/Va41HWS6Oxb",
            ios: "https://rnbwapp.com/e/OeMdmkJ6Oxb",
          }}
          platformUris={{
            ios: "rainbow://",
            android: "https://rnbwapp.com/",
            other: "https://rnbwapp.com/",
          }}
          prefetchedLocale={prefetchedLocale}
          prefetchedLocaleId={prefetchedLocaleId}
        />
      );
    },
    isInstalled() {
      return !!injectedRainbowProvider();
    },
    async prefetch(localeId) {
      const localeFn = await getInjectedWalletLocale(localeId);
      prefetchedLocale = localeFn(rainbowWalletMetadata.name);
      prefetchedLocaleId = localeId;
    },
  };

  return config;
};
