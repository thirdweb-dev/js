import {
  injectedMetamaskProvider,
  metamaskMetadata,
  metamaskWallet,
} from "../../../wallets/injected/wallets/metamask.js";
import { walletConnect } from "../../../wallets/wallet-connect/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedAndWCConnectUI } from "../shared/InjectedAndWCConnectUI.js";

export type MetamaskConfigOptions = {
  projectId?: string;
};

/**
 * Integrate MetaMask wallet connection into your app.
 * @param options - Options for configuring the MetaMask wallet.
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
export const metamaskConfig = (
  options?: MetamaskConfigOptions,
): WalletConfig => {
  const config: WalletConfig = {
    metadata: metamaskMetadata,
    create(createOptions) {
      if (config.isInstalled && config.isInstalled()) {
        return metamaskWallet();
      }

      return walletConnect({
        client: createOptions.client,
        dappMetadata: createOptions.dappMetadata,
        metadata: metamaskMetadata,
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
        />
      );
    },
    isInstalled() {
      return !!injectedMetamaskProvider();
    },
  };

  return config;
};
