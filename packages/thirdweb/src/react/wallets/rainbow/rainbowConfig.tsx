import {
  injectedProvider,
  rainbowWallet,
  rainbowWalletMetadata,
} from "../../../wallets/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedConnectUI } from "../shared/InjectedConnectUI.js";

/**
 * Integrate Rainbow wallet connection into your app.
 * @example
 * ```tsx
 * <ThirdwebProvider
 *  client={client}>
 *  wallets={[  metamaskConfig() ]}
 *  <App />
 * </ThirdwebProvider>
 * ```
 * @returns WalletConfig object to be passed into `ThirdwebProvider`
 */
export const rainbowConfig = (): WalletConfig => {
  return {
    connect: rainbowWallet,
    metadata: rainbowWalletMetadata,
    connectUI(props) {
      return (
        <InjectedConnectUI
          {...props}
          links={{
            extension:
              "https://chrome.google.com/webstore/detail/rainbow/opfgelmcmbiajamepnmloijbpoleiama",
            android: "https://rnbwapp.com/e/Va41HWS6Oxb",
            ios: "https://rnbwapp.com/e/OeMdmkJ6Oxb",
          }}
        />
      );
    },
    isInstalled() {
      return !!injectedProvider("me.rainbow");
    },
  };
};
