import {
  WalletConfig,
  ConnectUIProps,
  WalletOptions,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { SmartWalletConfig, SmartWalletConfigOptions } from "./types";
import { SmartWalletConnecting } from "./SmartWalletConnecting";
import { HeadlessConnectUI } from "../headlessConnectUI";

export const smartWallet = (
  wallet: WalletConfig<any>,
  config: SmartWalletConfigOptions,
): SmartWalletConfig => {
  return {
    ...wallet,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    connectUI(props) {
      return <SmartConnectUI {...props} personalWallet={wallet} />;
    },
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
    const _props = {
      ...props,
      walletConfig: PersonalWalletConfig,
      close: () => props.close(false),
    };

    if (PersonalWalletConfig.connectUI) {
      return <PersonalWalletConfig.connectUI {..._props} />;
    }

    return <HeadlessConnectUI {..._props} />;
  }

  return (
    <SmartWalletConnecting
      onBack={props.goBack}
      onConnect={props.close}
      smartWallet={walletConfig}
      personalWallet={props.personalWallet}
    />
  );
};
