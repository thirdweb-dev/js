import { SafeWallet } from "@thirdweb-dev/wallets";
import {
  ConfiguredWallet,
  ConnectUIProps,
  WalletOptions,
  useDisconnect,
  useWallet,
} from "@thirdweb-dev/react-core";
import { defaultWallets } from "../defaultWallets";
import { useState } from "react";
import { SelectpersonalWallet } from "./SelectPersonalWallet";
import { SafeWalletConfig, SafeWalletObj } from "./types";
import { SelectAccount } from "./SelectAccount";
import { HeadlessConnectUI } from "../headlessConnectUI";

export const safeWallet = (config?: SafeWalletConfig) => {
  const configuredWallet = {
    id: SafeWallet.id,
    meta: {
      name: "Safe",
      iconURL:
        "ipfs://QmbbyxDDmmLQh8DzzeUR6X6B75bESsNUFmbdvS3ZsQ2pN1/SafeToken.svg",
    },
    create: (options: WalletOptions) => new SafeWallet({ ...options }),
    config: {
      personalWallets: config?.personalWallets || defaultWallets,
    },
    connectUI(props) {
      return <SafeConnectUI {...props} configuredWallet={configuredWallet} />;
    },
    isInstalled() {
      return false;
    },
  } satisfies SafeWalletObj;

  return configuredWallet;
};

type SafeConnectUIProps = ConnectUIProps & {
  configuredWallet: ConfiguredWallet<SafeWallet, Required<SafeWalletConfig>>;
};

export const SafeConnectUI = (props: SafeConnectUIProps) => {
  const activeWallet = useWallet();
  const [personalConfiguredWallet, setPersonalConfiguredWallet] = useState<
    ConfiguredWallet | undefined
  >();
  const disconnect = useDisconnect();

  if (personalConfiguredWallet) {
    const _props = {
      close: () => {
        setPersonalConfiguredWallet(undefined);
        props.close(false); // do not reset
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
      <SelectpersonalWallet
        personalWallets={props.configuredWallet.config.personalWallets}
        onBack={props.goBack}
        safeWallet={props.configuredWallet}
        selectWallet={(wallet) => {
          setPersonalConfiguredWallet(wallet);
        }}
      />
    );
  }

  return (
    <SelectAccount
      onBack={disconnect}
      onConnect={props.close}
      safeWallet={props.configuredWallet}
    />
  );
};
