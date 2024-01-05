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
 * A wallet configurator for [Smart Wallet](https://portal.thirdweb.com/references/wallets/v2/SmartWallet) which allows integrating the wallet with React
 *
 * It returns a `WalletConfig` object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or `useConnect` hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
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
 * Provide a `WalletConfig` object to use as the personal wallet for the Smart Wallet.
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
