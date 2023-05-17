import {
  WalletConfig,
  ConnectUIProps,
  WalletOptions,
  useWallet,
  useConnectionStatus,
  useDisconnect,
} from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { SmartConfiguredWallet, SmartWalletConfig } from "./types";
import { useState } from "react";
import { SmartWalletConnecting } from "./SmartWalletConnecting";
import { SelectPersonalWallet } from "./SelectPersonalWallet";
import { HeadlessConnectUI } from "../headlessConnectUI";
import { defaultWallets } from "../defaultWallets";

export const smartWallet = (
  config: SmartWalletConfig,
): SmartConfiguredWallet => {
  return {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    connectUI(props) {
      return <SmartConnectUI {...props} />;
    },
    isInstalled() {
      return false;
    },
    personalWallets: config.personalWallets || defaultWallets,
    autoSwitch: true,
  };
};

export const SmartConnectUI = (props: ConnectUIProps<SmartWallet>) => {
  const activeWallet = useWallet();
  const { walletConfig } = props;
  const [personalConfiguredWallet, setPersonalConfiguredWallet] = useState<
    WalletConfig | undefined
  >();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();

  if (personalConfiguredWallet) {
    const _props = {
      close: () => {
        setPersonalConfiguredWallet(undefined);
        props.close(false); // do not reset UI
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
      <SelectPersonalWallet
        personalWallets={walletConfig.personalWallets as WalletConfig[]}
        onBack={props.goBack}
        smartWallet={walletConfig}
        selectWallet={setPersonalConfiguredWallet}
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
