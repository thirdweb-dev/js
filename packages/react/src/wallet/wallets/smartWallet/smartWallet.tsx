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
import { Container } from "../../../components/basic";
import { Spinner } from "../../../components/Spinner";

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
  const {
    setIsConnectingToPersonalWallet,
    personalWalletInfo,
    isConnectingToPersonalWallet,
  } = useWalletContext();
  const { walletConfig } = props;
  const [isPersonalWalletConnected, setIsPersonalWalletConnected] =
    useState(false);

  // hide the connection of personal wallet
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      setIsConnectingToPersonalWallet(true);
      mounted.current = true;
    }
  }, [setIsConnectingToPersonalWallet]);

  const PersonalWalletConfig = props.personalWallet;

  if (!isPersonalWalletConnected) {
    // if the isConnectingToPersonalWallet is not yet updated
    if (!isConnectingToPersonalWallet) {
      return (
        <Container
          flex="row"
          center="both"
          style={{
            minHeight: "250px",
          }}
        >
          <Spinner size="xl" color="accentText" />
        </Container>
      );
    }

    const _props: ConnectUIProps = {
      ...props,
      walletConfig: PersonalWalletConfig,
      connected: () => {
        setIsPersonalWalletConnected(true);
        setIsConnectingToPersonalWallet(false);
      },
      goBack() {
        personalWalletInfo?.disconnect();
        setIsConnectingToPersonalWallet(false);
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
      onBack={() => {
        personalWalletInfo?.disconnect();
        setIsConnectingToPersonalWallet(false);
        props.goBack();
      }}
      onConnect={props.connected}
      smartWallet={walletConfig}
      personalWalletConfig={props.personalWallet}
    />
  );
};
