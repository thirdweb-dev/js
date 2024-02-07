import {
  injectedRainbowProvider,
  rainbowWallet,
  rainbowWalletMetadata,
  walletConnect,
} from "../../../wallets/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedAndWCConnectUI } from "../shared/InjectedAndWCConnectUI.js";

export type RainbowConfigOptions = {
  projectId?: string;
};

/**
 * Integrate Rainbow wallet connection into your app.
 * @param options - Options for configuring the Rainbow wallet.
 * @example
 * ```tsx
 * <ThirdwebProvider
 *  client={client}>
 *  wallets={[  rainbowConfig() ]}
 *  <App />
 * </ThirdwebProvider>
 * ```
 * @returns WalletConfig object to be passed into `ThirdwebProvider`
 */
export const rainbowConfig = (options?: RainbowConfigOptions): WalletConfig => {
  const config: WalletConfig = {
    create(createOptions) {
      if (config.isInstalled && config.isInstalled()) {
        return rainbowWallet();
      }

      return walletConnect({
        client: createOptions.client,
        dappMetadata: createOptions.dappMetadata,
        metadata: rainbowWalletMetadata,
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
        />
      );
    },
    isInstalled() {
      return !!injectedRainbowProvider();
    },
  };

  return config;
};
