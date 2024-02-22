import {
  injectedRainbowProvider,
  rainbowWallet,
  rainbowWalletMetadata,
} from "../../../wallets/injected/wallets/rainbow.js";
import { walletConnect } from "../../../wallets/wallet-connect/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { InjectedAndWCConnectUI } from "../shared/InjectedAndWCConnectUI.js";

export type RainbowConfigOptions = {
  /**
   * This is only relevant when connecting to Rainbow wallet mobile app using QR code scanning. This uses WalletConnect protocol to connect to Rainbow wallet.
   *
   * WalletConnect requires a `projectId` that can be obtained at https://cloud.walletconnect.com/
   *
   * If you don't pass a `projectId`, a default `projectId` will be used that is created by thirdweb.
   *
   * Refer to [WalletConnect docs](https://docs.walletconnect.com) for more info
   */
  projectId?: string;
  /**
   * If `true`, Rainbow will be shown as "recommended" to the user in [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
   * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) 's UI
   */
  recommended?: boolean;
};

/**
 * Integrate Rainbow wallet connection in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider).
 * @param options - Options for configuring the Rainbow wallet.
 * Refer to [`RainbowConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/RainbowConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ThirdwebProvider, rainbowConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ThirdwebProvider client={client} wallets={[rainbowConfig()]}>
 *       <App />
 *     </ThirdwebProvider>
 *   );
 * }
 * ```
 * @returns `WalletConfig` object to be passed into `ThirdwebProvider`
 */
export const rainbowConfig = (options?: RainbowConfigOptions): WalletConfig => {
  const config: WalletConfig = {
    recommended: options?.recommended,
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
