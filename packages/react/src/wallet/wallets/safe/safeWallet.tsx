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
import { SafeWalletConfigOptions, SafeWalletConfig } from "./types";
import { SelectAccount } from "./SelectAccount";
import { HeadlessConnectUI } from "../headlessConnectUI";

export const safeWallet = (
  config?: SafeWalletConfigOptions,
): SafeWalletConfig => {
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
  props: ConnectUIProps<SafeWallet, Required<SafeWalletConfigOptions>>,
) => {
  const activeWallet = useWallet();
  const [personalWalletConfig, setPersonalWalletConfig] = useState<
    WalletConfig | undefined
  >();
  const disconnect = useDisconnect();

  if (personalWalletConfig) {
    const _props = {
      close: () => {
        setPersonalWalletConfig(undefined);
        props.close(false); // do not reset
      },
      goBack: () => {
        setPersonalWalletConfig(undefined);
      },
      isOpen: props.isOpen,
      open: props.open,
      theme: props.theme,
      walletConfig: personalWalletConfig,
      supportedWallets: props.walletConfig.config.personalWallets,
      selectionData: props.selectionData,
      setSelectionData: props.setSelectionData,
    };

    if (personalWalletConfig.connectUI) {
      return <personalWalletConfig.connectUI {..._props} />;
    }

    return <HeadlessConnectUI {..._props} />;
  }

  if (!activeWallet) {
    return (
      <SelectpersonalWallet
        personalWallets={props.walletConfig.config.personalWallets}
        onBack={props.goBack}
        safeWallet={props.walletConfig}
        selectWallet={setPersonalWalletConfig}
        renderBackButton={props.supportedWallets.length > 1}
      />
    );
  }

  return (
    <SelectAccount
      onBack={disconnect}
      onConnect={props.close}
      safeWalletConfig={props.walletConfig}
    />
  );
};
