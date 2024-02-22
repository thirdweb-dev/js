import {
  injectedMetamaskProvider,
  metamaskMetadata,
  metamaskWallet,
} from "../../../wallets/injected/wallets/metamask.js";
import { walletConnect } from "../../../wallets/wallet-connect/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedAndWCConnectUI } from "../shared/InjectedAndWCConnectUI.js";

export type MetamaskConfigOptions = {
  /**
   * This is only relevant when connecting to Metamask mobile app using QR code scanning. This uses WalletConnect protocol to connect to MetaMask.
   *
   * WalletConnect requires a `projectId` that can be obtained at https://cloud.walletconnect.com/
   *
   * If you don't pass a `projectId`, a default `projectId` will be used that is created by thirdweb.
   *
   * Refer to [WalletConnect docs](https://docs.walletconnect.com) for more info
   */
  projectId?: string;
  /**
   * If `true`, MetaMask will be shown as "recommended" to the user in [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
   * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) 's UI
   */
  recommended?: boolean;
};

/**
 * Integrate MetaMask wallet connection in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider).
 * @param options - Options for configuring the MetaMask wallet.
 * Refer to [`MetamaskConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/MetamaskConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ThirdwebProvider, metamaskConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ThirdwebProvider client={client} wallets={[metamaskConfig()]}>
 *       <App />
 *     </ThirdwebProvider>
 *   );
 * }
 * ```
 * @returns `WalletConfig` object to be passed into `ThirdwebProvider`
 */
export const metamaskConfig = (
  options?: MetamaskConfigOptions,
): WalletConfig => {
  const config: WalletConfig = {
    recommended: options?.recommended,
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
