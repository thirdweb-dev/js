import {
  localWallet,
  localWalletMetadata,
} from "../../../wallets/local/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { LocalWalletConnectUI } from "./LocalWalletConnectUI.js";

export type LocalWalletConfigOptions = {
  /**
   * If `true`, the wallet data will be stored on localStorage encrypted with user's password.
   * Because of this - a password creation step is required to connect the wallet.
   * When page is reloaded, the user will need to enter their password again to connect.
   *
   * If `false`, wallet data will not be stored, and no password will be required to connect.
   * The wallet will be lost when the user leaves or reloads the page - unless the user manually exports the wallet data.
   *
   * By default, it is set to `true`.
   */
  persist?: boolean;
};

/**
 * Integrate Local wallet connection in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider).
 * @param options - Options for configuring the Local wallet.
 * Refer to [`LocalWalletConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/LocalWalletConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ThirdwebProvider, localWalletConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ThirdwebProvider client={client} wallets={[localWalletConfig()]}>
 *       <App />
 *     </ThirdwebProvider>
 *   );
 * }
 * ```
 * @returns `WalletConfig` object to be passed into `ThirdwebProvider`
 */
export const localWalletConfig = (
  options?: LocalWalletConfigOptions,
): WalletConfig => {
  const config: WalletConfig = {
    metadata: localWalletMetadata,
    create(createOptions) {
      return localWallet({
        client: createOptions.client,
      });
    },
    connectUI(props) {
      return (
        <LocalWalletConnectUI
          connectUIProps={props}
          persist={options?.persist !== undefined ? options.persist : true}
        />
      );
    },
  };

  return config;
};
