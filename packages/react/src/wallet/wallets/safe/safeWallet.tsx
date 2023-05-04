import { SafeWallet } from "@thirdweb-dev/wallets";
import {
  ConfiguredWallet,
  ConnectUIProps,
  WalletOptions,
  useWallet,
} from "@thirdweb-dev/react-core";
import { defaultWallets } from "../defaultWallets";
import { useEffect } from "react";
import { SelectpersonalWallet } from "./SelectPersonalWallet";
import { SafeWalletConfig, SafeWalletObj } from "./types";
import { SelectAccount } from "./SelectAccount";

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
      <SelectpersonalWallet
        personalWallets={props.configuredWallet.config.personalWallets}
        onBack={props.goBack}
        safeWallet={props.configuredWallet}
        selectWallet={props.selectWallet}
      />
    );
  }

  return (
    <SelectAccount
      onBack={props.goBack}
      onConnect={() => {
        props.onConnect();
      }}
      safeWallet={props.configuredWallet}
    />
  );
};
