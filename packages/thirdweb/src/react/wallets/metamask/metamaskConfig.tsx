import {
  metamaskWallet,
  metamaskMetadata,
  injectedMetamaskProvider,
} from "../../../wallets/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedConnectUI } from "../shared/InjectedConnectUI.js";

/**
 * Integrate MetaMask wallet connection into your app.
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
export const metamaskConfig = (): WalletConfig => {
  return {
    metadata: metamaskMetadata,
    create() {
      return metamaskWallet();
    },
    connectUI(props) {
      return (
        <InjectedConnectUI
          {...props}
          links={{
            extension:
              "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
            android:
              "https://play.google.com/store/apps/details?id=io.metamask",
            ios: "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202",
          }}
        />
      );
    },
    isInstalled() {
      return !!injectedMetamaskProvider();
    },
  };
};
