import {
  zerionWallet,
  zerionWalletMetadata,
  injectedZerionProvider,
} from "../../../wallets/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedConnectUI } from "../shared/InjectedConnectUI.js";

/**
 * Integrate Zerion wallet connection into your app.
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
export const zerionConfig = (): WalletConfig => {
  return {
    create() {
      return zerionWallet();
    },
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
      return !!injectedZerionProvider();
    },
  };
};
