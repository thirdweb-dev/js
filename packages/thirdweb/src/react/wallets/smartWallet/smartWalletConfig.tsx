import { smartWallet } from "../../../wallets/smart/index.js";
import type { SmartWalletOptions } from "../../../wallets/smart/types.js";
import { useThirdwebProviderProps } from "../../hooks/others/useThirdwebProviderProps.js";
import type { SelectUIProps, WalletConfig } from "../../types/wallets.js";
import { WalletEntryButton } from "../../ui/ConnectWallet/WalletSelector.js";
import { SmartConnectUI } from "./SmartWalletConnectUI.js";

export type SmartWalletConfigOptions = Omit<
  SmartWalletOptions,
  "personalAccount" | "client"
>;

/**
 * Integrate a [smart wallet](https://portal.thirdweb.com/glossary/smart-wallet) connection using a personal wallet (acting as the key to the smart wallet) in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider).
 *
 * A Smart Wallet is a wallet that is controlled by a smart contract following the [ERC-4337 specification](https://eips.ethereum.org/EIPS/eip-4337).
 * @param walletConfig - `WalletConfig` object of a personal wallet to use with the smart wallet.
 * @param options - Options for configuring the Smart wallet.
 * Refer to [`SmartWalletConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/SmartWalletConfigOptions) for more details.
 * @example
 * ```tsx
 * import {
 *   ThirdwebProvider,
 *   metamaskConfig,
 *   smartWalletConfig,
 * } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ThirdwebProvider
 *       client={client}
 *       wallets={[
 *         smartWalletConfig(metamaskConfig(), smartWalletOptions),
 *         smartWalletConfig(coinbaseConfig(), smartWalletOptions),
 *       ]}
 *     >
 *       <App />
 *     </ThirdwebProvider>
 *   );
 * }
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
    recommended: walletConfig.recommended,
    category: walletConfig.category,
    metadata: metadata,
    create(createOptions) {
      return smartWallet({
        ...options,
        client: createOptions.client,
        metadata,
      });
    },
    selectUI: walletConfig.selectUI
      ? (props) => (
          <SmartSelectUI
            selectUIProps={props}
            personalWalletConfig={walletConfig}
          />
        )
      : undefined,
    connectUI(props) {
      return (
        <SmartConnectUI
          connectUIProps={props}
          personalWalletConfig={walletConfig}
          smartWalletChain={options.chain}
        />
      );
    },
    personalWalletConfigs: [walletConfig],
  };

  return config;
};

function SmartSelectUI(props: {
  selectUIProps: SelectUIProps;
  personalWalletConfig: WalletConfig;
}) {
  const { client, dappMetadata } = useThirdwebProviderProps();
  const { personalWalletConfig } = props;
  const PersonalWalletSelectUI = props.personalWalletConfig.selectUI;

  if (!PersonalWalletSelectUI) {
    return (
      <WalletEntryButton
        walletConfig={props.personalWalletConfig}
        selectWallet={() => {
          props.selectUIProps.selection.select();
        }}
      />
    );
  }

  return (
    <PersonalWalletSelectUI
      walletConfig={personalWalletConfig}
      screenConfig={props.selectUIProps.screenConfig}
      connection={{
        createInstance: () => {
          return personalWalletConfig.create({
            client,
            dappMetadata,
          });
        },
        done: () => {}, // ignore connection done in select UI
        chain: props.selectUIProps.connection.chain,
        chains: props.selectUIProps.connection.chains,
      }}
      selection={props.selectUIProps.selection}
    />
  );
}
