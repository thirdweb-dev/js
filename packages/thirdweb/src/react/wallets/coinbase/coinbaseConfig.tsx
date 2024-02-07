import {
  injectedCoinbaseProvider,
  coinbaseMetadata,
  coinbaseWallet,
} from "../../../wallets/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedConnectUI } from "../shared/InjectedConnectUI.js";

/**
 * Integrate Coinbase wallet connection into your app.
 * @example
 * ```tsx
 * <ThirdwebProvider
 *  client={client}>
 *  wallets={[  coinbaseConfig() ]}
 *  <App />
 * </ThirdwebProvider>
 * ```
 * @returns WalletConfig object to be passed into `ThirdwebProvider`
 */
export const coinbaseConfig = (): WalletConfig => {
  return {
    metadata: coinbaseMetadata,
    create() {
      return coinbaseWallet();
    },
    connectUI(props) {
      return (
        <InjectedConnectUI
          {...props}
          onGetStarted={() => {
            // TODO
          }}
          // links={{
          //   extension:
          //     "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
          //   android: "https://play.google.com/store/apps/details?id=org.toshi",
          //   ios: "https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455",
          // }}
        />
      );
    },
    isInstalled() {
      return !!injectedCoinbaseProvider();
    },
  };
};
