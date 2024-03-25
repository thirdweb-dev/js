import { smartWallet } from "../../../../wallets/smart/index.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import type {
  SelectUIProps,
  WalletConfig,
} from "../../../core/types/wallets.js";
import { WalletEntryButton } from "../../ui/ConnectWallet/WalletSelector.js";
import { asyncLocalStorage } from "../../../core/utils/asyncLocalStorage.js";
import { SmartConnectUI } from "./SmartWalletConnectUI.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";

export type SmartWalletConfigOptions = Omit<
  SmartWalletOptions,
  "personalAccount" | "client" | "storage" | "metadata"
>;

/**
 * Integrate a [smart wallet](https://portal.thirdweb.com/glossary/smart-wallet) connection using a personal wallet (acting as the key to the smart wallet) in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in `wallets` prop.
 *
 * A Smart Wallet is a wallet that is controlled by a smart contract following the [ERC-4337 specification](https://eips.ethereum.org/EIPS/eip-4337).
 * @param walletConfig - `WalletConfig` object of a personal wallet to use with the smart wallet.
 * @param options - Options for configuring the Smart wallet.
 * Refer to [`SmartWalletConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/SmartWalletConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ConnectButton, smartWalletConfig, metamaskConfig, coinbaseConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ConnectButton
 *      client={client}
 *      wallets={[
 *        smartWalletConfig(metamaskConfig(), options),
 *        smartWalletConfig(coinbaseConfig(), options),
 *      ]}
 *      appMetadata={appMetadata}
 *     />
 *   );
 * }
 * ```
 * @returns `WalletConfig` object which can be added to the `wallets` prop in either `ConnectButton` or `ConnectEmbed` component.
 * @walletConfig
 */
export const smartWalletConfig = (
  walletConfig: WalletConfig,
  options: SmartWalletConfigOptions,
): WalletConfig => {
  const config: WalletConfig = {
    recommended: walletConfig.recommended,
    category: walletConfig.category,
    metadata: walletConfig.metadata,
    create(createOptions) {
      return smartWallet({
        ...options,
        client: createOptions.client,
        metadata: walletConfig.metadata,
        storage: asyncLocalStorage,
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
  const { client, appMetadata } = useWalletConnectionCtx();
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
            appMetadata,
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
