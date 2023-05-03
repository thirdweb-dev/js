import {
  ConnectUIProps,
  WalletOptions,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { defaultWallets } from "../defaultWallets";
import { SmartConfiguredWallet, SmartWalletConfig } from "./types";
import { useEffect } from "react";
import { SmartWalletConnecting } from "./SmartWalletConnecting";
import { SelectPersonalWallet } from "./SelectPersonalWallet";

export const smartWallet = (config: SmartWalletConfig) => {
  const configuredWallet = {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    connectUI(props) {
      return <SmartConnectUI {...props} configuredWallet={configuredWallet} />;
    },
    isInstalled() {
      return false;
    },
    config: {
      ...config,
      personalWallets: config?.personalWallets || defaultWallets,
    },
  } satisfies SmartConfiguredWallet;

  return configuredWallet;
};

type SafeConnectUIProps = ConnectUIProps & {
  configuredWallet: SmartConfiguredWallet;
};

export const SmartConnectUI = (props: SafeConnectUIProps) => {
  const activeWallet = useWallet();
  const { setWrapperWallet, configuredWallet } = props;

  useEffect(() => {
    if (!activeWallet) {
      setWrapperWallet(configuredWallet);
    } else {
      setWrapperWallet(undefined);
    }
  }, [activeWallet, configuredWallet, setWrapperWallet]);

  if (!activeWallet) {
    return (
      <SelectPersonalWallet
        personalWallets={configuredWallet.config.personalWallets}
        onBack={props.goBack}
        smartWallet={configuredWallet}
        selectWallet={props.selectWallet}
      />
    );
  }

  return (
    <SmartWalletConnecting
      onBack={props.goBack}
      onConnect={() => {
        props.onConnect();
      }}
      smartWallet={configuredWallet}
    />
  );
};
