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
 * A wallet configurator for [Smart Wallet](https://portal.thirdweb.com/wallet/smart-wallet) which allows integrating the wallet with React
 *
 * It returns a `WalletConfig` object which can be used to connect the wallet to app via `ConnectWallet` component or `useConnect` hook.
 *
 * @example
 *
 * ### Usage with ConnectWallet
 *
 * To allow users to connect to this wallet using the `ConnectWallet` component, you can add it to `ThirdwebProvider`'s supportedWallets prop.
 *
 * ```tsx
 * import {
 *   smartWallet,
 *   metamaskWallet,
 *   coinbaseWallet,
 *   walletConnect,
 * } from "@thirdweb-dev/react";
 *
 * const config = {
 *   factoryAddress: "0x...",
 *   gasless: true,
 * }
 *
 * <ThirdwebProvider
 *   supportedWallets={[
 *     smartWallet(metamaskWallet(), config),
 *     smartWallet(coinbaseWallet(), config),
 *     smartWallet(walletConnect(), config),
 *   ]}
 *   clientId="your-client-id"
 * >
 *   <YourApp />
 * </ThirdwebProvider>;
 * ```
 *
 * ### Usage with useConnect
 *
 * you can use the `useConnect` hook to programmatically connect to the wallet without using the `ConnectWallet` component.
 *
 * The wallet also needs to be added in `ThirdwebProvider`'s supportedWallets if you want the wallet to auto-connect on next page load.
 *
 * You need to connect to a personal wallet first, You can use the useConnect hook to connect to a personal wallet first and then connect to the Smart Wallet. Make sure personal wallet is on the same network as the Smart Wallet.
 *
 * ```tsx
 * import { useConnect, smartWallet, metamaskWallet } from "@thirdweb-dev/react";
 * import { Goerli } from "@thirdweb-dev/chains";
 *
 * const personalWalletConfig = metamaskWallet(); // or use any other wallet
 *
 * const smartWalletConfig = smartWallet(personalWalletConfig, {
 *   factoryAddress: "0x...",
 *   gasless: true,
 * });
 *
 * function App() {
 *   const connect = useConnect();
 *
 *   const handleConnect = async () => {
 *     // 1. connect the personal wallet first on the network that the smart wallet is deployed to
 *     const personalWallet = await connect(personalWalletConfig, {
 *       chainId: Goerli.chainId,
 *     });
 *
 *     // 2. connect to smart wallet
 *     const smartWallet = await connect(smartWalletConfig, {
 *       chainId: Goerli.chainId,
 *       personalWallet: personalWallet,
 *     });
 *
 *     console.log("connected to", smartWallet);
 *   };
 *
 *   return <div> ... </div>;
 * }
 * ```
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
      onLocallyConnected={props.onLocallyConnected}
      connectedWallet={personalWalletConnection.activeWallet}
      connectedWalletAddress={personalWalletConnection.connectedAddress}
    />
  );
};

export const SmartConnectUI = (
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
      onLocallyConnected: props.onLocallyConnected,
      connectedWallet: personalWalletConnection.activeWallet,
      connectedWalletAddress: personalWalletConnection.connectedAddress,
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
      personalWalletChainId={personalWalletConnection.connectedChainId || 1}
      switchChainPersonalWallet={personalWalletConnection.switchChain}
    />
  );
};
