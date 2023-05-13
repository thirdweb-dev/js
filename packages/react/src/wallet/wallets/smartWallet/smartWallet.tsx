import {
  ConfiguredWallet,
  ConnectUIProps,
  WalletOptions,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { defaultWallets } from "../defaultWallets";
import { SmartConfiguredWallet, SmartWalletConfig } from "./types";
import { useState } from "react";
import { SmartWalletConnecting } from "./SmartWalletConnecting";
import { SelectPersonalWallet } from "./SelectPersonalWallet";
import { HeadlessConnectUI } from "../headlessConnectUI";

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
  const { configuredWallet } = props;
  const [personalConfiguredWallet, setPersonalConfiguredWallet] = useState<
    ConfiguredWallet | undefined
  >();

  if (personalConfiguredWallet) {
    const _props = {
      close: () => {
        setPersonalConfiguredWallet(undefined);
        props.close(false); // do not reset UI
      },
      goBack: () => {
        setPersonalConfiguredWallet(undefined);
      },
      isOpen: props.isOpen,
      open: props.open,
      theme: props.theme,
    };

    if (personalConfiguredWallet.connectUI) {
      return <personalConfiguredWallet.connectUI {..._props} />;
    }

    return (
      <HeadlessConnectUI
        {..._props}
        configuredWallet={personalConfiguredWallet}
      />
    );
  }

  if (!activeWallet) {
    return (
      <SelectPersonalWallet
        personalWallets={configuredWallet.config.personalWallets}
        onBack={props.goBack}
        smartWallet={configuredWallet}
        selectWallet={setPersonalConfiguredWallet}
      />
    );
  }

  return (
    <SmartWalletConnecting
      onBack={props.goBack}
      onConnect={props.close}
      smartWallet={configuredWallet}
    />
  );
};
