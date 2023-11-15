import {
  WalletConfig,
  ConnectUIProps,
  WalletOptions,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { SmartWalletConfig, SmartWalletConfigOptions } from "./types";
import { SmartWalletConnecting } from "./SmartWalletConnecting";
import { HeadlessConnectUI } from "../headlessConnectUI";
import { useRef, useEffect, useState } from "react";

export const smartWallet = (
  wallet: WalletConfig<any>,
  config: SmartWalletConfigOptions,
): SmartWalletConfig => {
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
  const { setIsConnectionHidden } = useWalletContext();
  const { walletConfig } = props;
  const [isPersonalWalletConnected, setIsPersonalWalletConnected] =
    useState(false);

  // hide the connection of personal wallet
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      setIsConnectionHidden(true);
      mounted.current = true;
    }
  }, [setIsConnectionHidden]);

  const PersonalWalletConfig = props.personalWallet;

  if (!isPersonalWalletConnected) {
    const _props: ConnectUIProps = {
      ...props,
      walletConfig: PersonalWalletConfig,
      connected: () => {
        setIsPersonalWalletConnected(true);
      },
      goBack() {
        setIsConnectionHidden(false);
        props.goBack();
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
      personalWalletConfig={props.personalWallet}
    />
  );
};
