import {
  injectedZerionProvider,
  zerionWallet,
  zerionWalletMetadata,
} from "../../../wallets/injected/wallets/zerion.js";
import { walletConnect } from "../../../wallets/wallet-connect/index.js";
import type { WalletConfig } from "../../types/wallets.js";
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
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider).
 * @param options - Options for configuring the Zerion wallet.
 * Refer to [`ZerionConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/ZerionConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ThirdwebProvider, zerionConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ThirdwebProvider client={client} wallets={[zerionConfig()]}>
 *       <App />
 *     </ThirdwebProvider>
 *   );
 * }
 * ```
 * @returns `WalletConfig` object to be passed into `ThirdwebProvider`
 */
export const zerionConfig = (options?: ZerionConfigOptions): WalletConfig => {
  const config: WalletConfig = {
    recommended: options?.recommended,
    create(createOptions) {
      if (config.isInstalled && config.isInstalled()) {
        return zerionWallet();
      }

      return walletConnect({
        client: createOptions.client,
        dappMetadata: createOptions.dappMetadata,
        metadata: zerionWalletMetadata,
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
        />
      );
    },
    isInstalled() {
      return !!injectedZerionProvider();
    },
  };

  return config;
};
