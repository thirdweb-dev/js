import { SafeWallet } from "@thirdweb-dev/wallets";
import {
  WalletConfig,
  ConnectUIProps,
  WalletOptions,
  useDisconnect,
  useWallet,
  useConnectionStatus,
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
    personalWallets: config?.personalWallets || defaultWallets,
    autoSwitch: true,
  };
};

export const SafeConnectUI = (props: ConnectUIProps<SafeWallet>) => {
  const activeWallet = useWallet();
  const [personalConfiguredWallet, setPersonalConfiguredWallet] = useState<
    WalletConfig | undefined
  >();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();

  if (personalConfiguredWallet) {
    const _props = {
      close: () => {
        setPersonalConfiguredWallet(undefined);
        props.close(false); // do not reset
      },
      goBack: () => {
        setPersonalConfiguredWallet(undefined);
        if (connectionStatus === "connecting") {
          disconnect();
        }
      },
      isOpen: props.isOpen,
      open: props.open,
      theme: props.theme,
      walletConfig: personalConfiguredWallet,
      supportedWallets: props.walletConfig.personalWallets as WalletConfig[],
      selectionData: props.selectionData,
      setSelectionData: props.setSelectionData,
    };

    if (personalConfiguredWallet.connectUI) {
      return <personalConfiguredWallet.connectUI {..._props} />;
    }

    return <HeadlessConnectUI {..._props} />;
  }

  if (!activeWallet) {
    return (
      <SelectpersonalWallet
        personalWallets={props.walletConfig.personalWallets as WalletConfig[]}
        onBack={props.goBack}
        safeWallet={props.walletConfig}
        selectWallet={setPersonalConfiguredWallet}
        renderBackButton={props.supportedWallets.length > 1}
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
