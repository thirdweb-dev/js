import {
  metamaskWallet,
  metamaskMetadata,
  injectedMetamaskProvider,
  walletConnect,
} from "../../../wallets/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedConnectUI } from "../shared/InjectedConnectUI.js";
import { WalletConnectScan } from "../shared/WalletConnectScanUI.js";

const isMetamaskInjected = () => !!injectedMetamaskProvider();

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
  return {
    metadata: metamaskMetadata,
    create(createOptions) {
      if (!isMetamaskInjected()) {
        return walletConnect({
          client: createOptions.client,
          dappMetadata: createOptions.dappMetadata,
          metadata: metamaskMetadata,
        });
      }

      return metamaskWallet();
    },
    connectUI(props) {
      if (!isMetamaskInjected()) {
        return (
          <WalletConnectScan
            connectUIProps={props}
            onGetStarted={() => {
              // TODO
            }}
            platformUris={{
              ios: "metamask://",
              android: "https://metamask.app.link/",
              other: "https://metamask.app.link/",
            }}
            onBack={props.screenConfig.goBack}
            projectId={options?.projectId}
          />
        );
      }

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
    isInstalled: isMetamaskInjected,
  };
};
