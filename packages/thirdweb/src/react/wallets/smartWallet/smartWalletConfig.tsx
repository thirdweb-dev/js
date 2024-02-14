import {
  smartWallet,
  type SmartWalletOptions,
} from "../../../wallets/index.js";
import type { WalletConfig } from "../../types/wallets.js";
import { SmartConnectUI } from "./SmartWalletConnectUI.js";

export type SmartWalletConfigOptions = Omit<
  SmartWalletOptions,
  "personalAccount" | "client"
>;

/**
 * Integrate Smart wallet connection into your app.
 * @param walletConfig - WalletConfig object of a personal wallet to use with the smart wallet.
 * @param options - Options for configuring the Smart wallet.
 * @example
 * ```tsx
 * <ThirdwebProvider
 *  client={client}>
 *    wallets={[
 *      smartWalletConfig(metamaskConfig(), smartWalletOptions),
 *      smartWalletConfig(coinbaseConfig(), smartWalletOptions)
 *    ]}
 *  <App />
 * </ThirdwebProvider>
 * ```
 * @returns WalletConfig object to be passed into `ThirdwebProvider`
 */
export const smartWalletConfig = (
  walletConfig: WalletConfig,
  options: SmartWalletConfigOptions,
): WalletConfig => {
  const config: WalletConfig = {
    metadata: walletConfig.metadata,
    create(createOptions) {
      const wallet = smartWallet({ ...options, client: createOptions.client });
      wallet.metadata = walletConfig.metadata;
      return wallet;
    },
    connectUI(props) {
      const chain = options.chain;
      const chainId =
        typeof chain === "bigint"
          ? chain
          : typeof chain === "number"
            ? BigInt(chain)
            : BigInt(chain.id);

      return (
        <SmartConnectUI
          connectUIProps={props}
          personalWalletConfig={walletConfig}
          smartWalletChainId={chainId}
        />
      );
    },
  };

  return config;
};
