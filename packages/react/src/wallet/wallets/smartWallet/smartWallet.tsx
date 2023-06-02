import {
  WalletConfig,
  ConnectUIProps,
  WalletOptions,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { defaultWallets } from "../defaultWallets";
import { SmartWalletConfig, SmartWalletConfigOptions } from "./types";
import { useState } from "react";
import { SmartWalletConnecting } from "./SmartWalletConnecting";
import { SelectPersonalWallet } from "./SelectPersonalWallet";
import { HeadlessConnectUI } from "../headlessConnectUI";

export const smartWallet = (
  config: SmartWalletConfigOptions,
): SmartWalletConfig => {
  return {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    connectUI: SmartConnectUI,
    isInstalled() {
      return false;
    },
    config: {
      ...config,
      personalWallets: config?.personalWallets || defaultWallets,
    },
  };
};

export const SmartConnectUI = (
  props: ConnectUIProps<SmartWallet, SmartWalletConfigOptions>,
) => {
  const activeWallet = useWallet();
  const { walletConfig } = props;
  const [personalWalletConfig, setPersonalWalletConfig] = useState<
    WalletConfig | undefined
  >();

  if (personalWalletConfig) {
    const _props = {
      close: () => {
        setPersonalWalletConfig(undefined);
        props.close(false); // do not reset UI
      },
      goBack: () => {
        setPersonalWalletConfig(undefined);
      },
      isOpen: props.isOpen,
      open: props.open,
      theme: props.theme,
      walletConfig: personalWalletConfig,
      supportedWallets: props.walletConfig.config
        .personalWallets as WalletConfig[],
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
      <SelectPersonalWallet
        personalWallets={walletConfig.config.personalWallets as WalletConfig[]}
        onBack={props.goBack}
        smartWallet={walletConfig}
        selectWallet={setPersonalWalletConfig}
        renderBackButton={props.supportedWallets.length > 1}
      />
    );
  }

  return (
    <SmartWalletConnecting
      onBack={props.goBack}
      onConnect={props.close}
      smartWallet={walletConfig}
    />
  );
};
