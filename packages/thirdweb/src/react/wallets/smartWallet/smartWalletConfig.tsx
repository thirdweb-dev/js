import { getChainIdFromChain } from "../../../chain/index.js";
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
  // prefix the id of personal wallet with "smart+"
  // keep the name and iconUrl of the personal wallet
  const metadata = {
    ...walletConfig.metadata,
    id: "smart+" + walletConfig.metadata.id,
  };

  const config: WalletConfig = {
    metadata: metadata,
    create(createOptions) {
      return smartWallet({
        ...options,
        client: createOptions.client,
        metadata,
      });
    },
    connectUI(props) {
      const chain = options.chain;
      const chainId = getChainIdFromChain(chain);

      return (
        <SmartConnectUI
          connectUIProps={props}
          personalWalletConfig={walletConfig}
          smartWalletChainId={chainId}
        />
      );
    },
    personalWalletConfigs: [walletConfig],
  };

  return config;
};
