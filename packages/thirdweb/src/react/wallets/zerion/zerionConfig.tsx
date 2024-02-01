import {
  injectedProvider,
  zerionWallet,
  zerionWalletMetadata,
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
export const zerionConfig = (): WalletConfig => {
  return {
    connect: zerionWallet,
    metadata: zerionWalletMetadata,
    connectUI(props) {
      return (
        <InjectedConnectUI
          {...props}
          links={{
            extension: "https://zerion.io/extension",
            android: "https://link.zerion.io/901o6IN0jqb",
            ios: "https://link.zerion.io/a11o6IN0jqb",
          }}
        />
      );
    },
    isInstalled() {
      return !!injectedProvider("io.zerion.wallet");
    },
  };
};
