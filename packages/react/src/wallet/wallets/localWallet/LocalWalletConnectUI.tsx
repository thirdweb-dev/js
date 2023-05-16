import { Spinner } from "../../../components/Spinner";
import {
  CreateLocalWallet_Guest,
  CreateLocalWallet_Password,
} from "./CreateLocalWallet";
import { ReconnectLocalWallet } from "./ReconnectLocalWallet";
import { Flex } from "../../../components/basic";
import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { LocalWalletConfig } from "./types";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import type { LocalWallet } from "@thirdweb-dev/wallets";

export const LocalWalletConnectUI = (
  props: ConnectUIProps<LocalWallet, LocalWalletConfig>,
) => {
  const { walletData } = useLocalWalletInfo(props.walletConfig);

  if (!props.walletConfig.config.persist) {
    return (
      <CreateLocalWallet_Guest
        localWallet={props.walletConfig}
        goBack={props.goBack}
        onConnect={props.close}
      />
    );
  }

  if (walletData === "loading") {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        style={{
          height: "300px",
        }}
      >
        <Spinner size="lg" color="primary" />
      </Flex>
    );
  }

  if (walletData) {
    return (
      <ReconnectLocalWallet
        onConnect={props.close}
        goBack={props.goBack}
        localWallet={props.walletConfig}
      />
    );
  }

  return (
    <CreateLocalWallet_Password
      goBack={props.goBack}
      localWalletConf={props.walletConfig}
      onConnect={props.close}
    />
  );
};
