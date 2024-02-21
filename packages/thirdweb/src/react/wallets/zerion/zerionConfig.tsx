import {
  injectedZerionProvider,
  zerionWallet,
  zerionWalletMetadata,
} from "../../../wallets/injected/wallets/zerion.js";
import { walletConnect } from "../../../wallets/wallet-connect/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedAndWCConnectUI } from "../shared/InjectedAndWCConnectUI.js";

export type ZerionConfigOptions = {
  projectId?: string;
};

/**
 * Integrate Zerion wallet connection into your app.
 * @param options - Options for configuring the Zerion wallet.
 * @example
 * ```tsx
 * <ThirdwebProvider
 *  client={client}>
 *  wallets={[  zerionConfig() ]}
 *  <App />
 * </ThirdwebProvider>
 * ```
 * @returns WalletConfig object to be passed into `ThirdwebProvider`
 */
export const zerionConfig = (options?: ZerionConfigOptions): WalletConfig => {
  const config: WalletConfig = {
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
