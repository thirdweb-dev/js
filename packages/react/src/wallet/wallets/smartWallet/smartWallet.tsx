import {
  type WalletConfig,
  type ConnectUIProps,
  type WalletOptions,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { SmartWalletConfigOptions } from "./types";
import { SmartWalletConnecting } from "./SmartWalletConnecting";
import { HeadlessConnectUI } from "../headlessConnectUI";

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
 *
 * @wallet
 */
export const smartWallet = (
  wallet: WalletConfig<any>,
  config: SmartWalletConfigOptions,
): WalletConfig<SmartWallet> => {
  const WalletSelectUI = wallet.selectUI;

  return {
    ...wallet,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    connectUI(props) {
      return <SmartConnectUI {...props} personalWallet={wallet} />;
    },
    selectUI: WalletSelectUI
      ? (props) => {
          return <WalletSelectUI {...props} walletConfig={wallet} />;
        }
      : undefined,
    personalWallets: [wallet],
  };
};

export const SmartConnectUI = (
  props: ConnectUIProps<SmartWallet> & { personalWallet: WalletConfig },
) => {
  const activeWallet = useWallet();
  const { walletConfig } = props;

  const PersonalWalletConfig = props.personalWallet;

  if (!activeWallet) {
    const _props: ConnectUIProps = {
      ...props,
      walletConfig: PersonalWalletConfig,
      connected: () => {
        // override to no-op
      },
    };

    if (PersonalWalletConfig.connectUI) {
      return <PersonalWalletConfig.connectUI {..._props} />;
    }

    return <HeadlessConnectUI {..._props} />;
  }

  return (
    <SmartWalletConnecting
      onBack={props.goBack}
      onConnect={props.connected}
      smartWallet={walletConfig}
      personalWallet={props.personalWallet}
    />
  );
};
