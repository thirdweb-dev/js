import {
  type WalletConfig,
  type ConnectUIProps,
  type WalletOptions,
  useWalletContext,
  SelectUIProps,
  WalletInstance,
} from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { SmartWalletConfigOptions } from "./types";
import { SmartWalletConnecting } from "./SmartWalletConnecting";
import { HeadlessConnectUI } from "../headlessConnectUI";
import { WalletEntryButton } from "../../ConnectWallet/WalletSelector";

/**
 * A wallet configurator for [Smart Wallet](https://portal.thirdweb.com/references/wallets/v2/SmartWallet) which allows integrating the wallet with React
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * smartWallet(
 *  metamaskWallet(),
 *  {
 *    factoryAddress: '0x...',
 *    gasless: true,
 *  }
 * )
 * ```
 *
 * @param wallet -
 * Provide a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object to use as the personal wallet for the Smart Wallet.
 *
 * You can get this object by calling a wallet configurator function such as `metamaskWallet()`
 *
 * @param config -
 * Configuration options for the Smart Wallet
 *
 * ### factoryAddress
 * The address of the Smart Wallet Factory contract. Must be of type `string`
 *
 * ### gasless
 * Whether to turn on or off gasless transactions. Must be a `boolean`.
 *
 * - If set to `true`, all gas fees will be paid by a paymaster.
 * - If set to `false`, all gas fees will be paid by the Smart Wallet itself (needs to be funded).
 *
 * @wallet
 */
export const smartWallet = (
  walletConfig: WalletConfig<any>,
  config: SmartWalletConfigOptions,
): WalletConfig<SmartWallet> => {
  return {
    ...walletConfig,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    connectUI(props) {
      return <SmartConnectUI {...props} personalWalletConfig={walletConfig} />;
    },
    selectUI: walletConfig.selectUI
      ? (props) => (
          <SmartSelectUI {...props} personalWalletConfig={walletConfig} />
        )
      : undefined,

    personalWallets: [walletConfig],
  };
};

const SmartSelectUI = (
  props: SelectUIProps<SmartWallet> & {
    personalWalletConfig: WalletConfig<any>;
  },
) => {
  const { personalWalletConnection } = useWalletContext();

  const PersonalWalletSelectUI = props.personalWalletConfig.selectUI;

  if (!PersonalWalletSelectUI) {
    return (
      <WalletEntryButton
        walletConfig={props.personalWalletConfig}
        selectWallet={() => {
          props.onSelect(undefined);
        }}
      />
    );
  }

  return (
    <PersonalWalletSelectUI
      walletConfig={props.personalWalletConfig}
      connect={(options: any) => {
        return personalWalletConnection.connectWallet(
          props.personalWalletConfig,
          options,
        );
      }}
      createWalletInstance={() => {
        return personalWalletConnection.createWalletInstance(
          props.personalWalletConfig,
        );
      }}
      modalSize={props.modalSize}
      onSelect={props.onSelect}
      setConnectedWallet={(wallet) => {
        personalWalletConnection.setConnectedWallet(wallet);
      }}
      setConnectionStatus={(status) => {
        personalWalletConnection.setConnectionStatus(status);
      }}
      connectionStatus={personalWalletConnection.connectionStatus}
      supportedWallets={props.supportedWallets}
      theme={props.theme}
      connectedWallet={personalWalletConnection.activeWallet}
      connectedWalletAddress={personalWalletConnection.address}
    />
  );
};

const SmartConnectUI = (
  props: ConnectUIProps<SmartWallet> & { personalWalletConfig: WalletConfig },
) => {
  const { personalWalletConnection } = useWalletContext();
  const { walletConfig } = props;
  const { personalWalletConfig } = props;

  if (!personalWalletConnection.activeWallet) {
    const _props: ConnectUIProps<WalletInstance> = {
      walletConfig: personalWalletConfig,
      connected: () => {
        // override to no-op
      },
      connect(options) {
        return personalWalletConnection.connectWallet(
          personalWalletConfig,
          options,
        );
      },
      setConnectedWallet(wallet) {
        personalWalletConnection.setConnectedWallet(wallet);
      },
      setConnectionStatus(status) {
        personalWalletConnection.setConnectionStatus(status);
      },
      connectionStatus: personalWalletConnection.connectionStatus,
      createWalletInstance: () => {
        return personalWalletConnection.createWalletInstance(
          props.personalWalletConfig,
        );
      },
      goBack: props.goBack,
      hide: props.hide,
      isOpen: props.isOpen,
      modalSize: props.modalSize,
      selectionData: props.selectionData,
      setSelectionData: props.setSelectionData,
      show: props.show,
      supportedWallets: props.supportedWallets,
      theme: props.theme,
      connectedWallet: personalWalletConnection.activeWallet,
      connectedWalletAddress: personalWalletConnection.address,
    };

    if (personalWalletConfig.connectUI) {
      return <personalWalletConfig.connectUI {..._props} />;
    }

    return <HeadlessConnectUI {..._props} />;
  }

  return (
    <SmartWalletConnecting
      onBack={props.goBack}
      onConnect={() => {
        props.connected();
      }}
      smartWallet={walletConfig}
      personalWalletConfig={personalWalletConfig}
      personalWallet={personalWalletConnection.activeWallet}
      personalWalletChainId={personalWalletConnection.chainId || 1}
      switchChainPersonalWallet={personalWalletConnection.switchChain}
    />
  );
};
