import {
  injectedOkxProvider,
  okxWallet,
  okxWalletMetadata,
} from "../../../../wallets/injected/wallets/okx.js";
import { walletConnect } from "../../../../wallets/wallet-connect/index.js";
import type { WalletConfig } from "../../../core/types/wallets.js";
import { asyncLocalStorage } from "../../../core/utils/asyncLocalStorage.js";
import type { LocaleId } from "../../ui/types.js";
import { getInjectedWalletLocale } from "../injected/locale/getInjectedWalletLocale.js";
import type { InjectedWalletLocale } from "../injected/locale/types.js";
import { InjectedAndWCConnectUI } from "../shared/InjectedAndWCConnectUI.js";

export type OkxConfigOptions = {
  /**
   * This is only relevant when connecting to OKX wallet mobile app using QR code scanning. This uses WalletConnect protocol to connect to Zerion wallet.
   *
   * WalletConnect requires a `projectId` that can be obtained at https://cloud.walletconnect.com/
   *
   * If you don't pass a `projectId`, a default `projectId` will be used that is created by thirdweb.
   *
   * Refer to [WalletConnect docs](https://docs.walletconnect.com) for more info
   */
  projectId?: string;
  /**
   * If `true`, OKX wallet will be shown as "recommended" to the user in [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
   * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) 's UI
   */
  recommended?: boolean;
};

/**
 * Integrate OKX wallet connection in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in `wallets` prop.
 * @param options - Options for configuring the OKX wallet.
 * Refer to [`OkxConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/OkxConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ConnectButton, okxConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ConnectButton
 *      client={client}
 *      wallets={[okxConfig()]}
 *      appMetadata={appMetadata}
 *     />
 *   );
 * }
 * ```
 * @returns `WalletConfig` object which can be added to the `wallets` prop in either `ConnectButton` or `ConnectEmbed` component.
 */
export const okxConfig = (options?: OkxConfigOptions): WalletConfig => {
  let prefetchedLocale: InjectedWalletLocale;
  let prefetchedLocaleId: LocaleId;

  const config: WalletConfig = {
    recommended: options?.recommended,
    create(createOptions) {
      if (config.isInstalled && config.isInstalled()) {
        return okxWallet();
      }

      return walletConnect({
        client: createOptions.client,
        appMetadata: createOptions.appMetadata,
        metadata: okxWalletMetadata,
        storage: asyncLocalStorage,
      });
    },
    metadata: okxWalletMetadata,
    connectUI(props) {
      return (
        <InjectedAndWCConnectUI
          {...props}
          projectId={options?.projectId}
          links={{
            extension:
              "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
            android:
              "https://play.google.com/store/apps/details?id=com.okinc.okex.gp",
            ios: "https://apps.apple.com/us/app/okx-buy-bitcoin-eth-crypto/id1327268470",
          }}
          platformUris={{
            ios: "okx://",
            android: "okx://",
            other: "okx://",
          }}
          prefetchedLocale={prefetchedLocale}
          prefetchedLocaleId={prefetchedLocaleId}
        />
      );
    },
    isInstalled() {
      return !!injectedOkxProvider();
    },
    async prefetch(localeId) {
      const localeFn = await getInjectedWalletLocale(localeId);
      prefetchedLocale = localeFn(okxWalletMetadata.name);
      prefetchedLocaleId = localeId;
    },
  };

  return config;
};
