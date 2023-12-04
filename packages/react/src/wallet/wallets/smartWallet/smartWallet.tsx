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
