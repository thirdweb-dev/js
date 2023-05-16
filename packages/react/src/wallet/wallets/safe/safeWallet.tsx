import { SafeWallet } from "@thirdweb-dev/wallets";
import {
  WalletConfig,
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

export const safeWallet = (config?: SafeWalletConfig): SafeWalletObj => {
  return {
    id: SafeWallet.id,
    meta: SafeWallet.meta,
    create: (options: WalletOptions) => new SafeWallet({ ...options }),
    connectUI: SafeConnectUI,
    isInstalled() {
      return false;
    },
    config: {
      personalWallets: config?.personalWallets || defaultWallets,
    },
  };
};

export const SafeConnectUI = (
  props: ConnectUIProps<SafeWallet, Required<SafeWalletConfig>>,
) => {
  const activeWallet = useWallet();
  const [personalConfiguredWallet, setPersonalConfiguredWallet] = useState<
    WalletConfig | undefined
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
      walletConfig: personalConfiguredWallet,
    };

    if (personalConfiguredWallet.connectUI) {
      return <personalConfiguredWallet.connectUI {..._props} />;
    }

    return <HeadlessConnectUI {..._props} />;
  }

  if (!activeWallet) {
    return (
      <SelectpersonalWallet
        personalWallets={props.walletConfig.config.personalWallets}
        onBack={props.goBack}
        safeWallet={props.walletConfig}
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
      safeWallet={props.walletConfig}
    />
  );
};
