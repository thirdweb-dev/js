import { Spinner } from "../../../components/Spinner";
import {
  CreateLocalWallet_Guest,
  CreateLocalWallet_Password,
} from "./CreateLocalWallet";
import { ReconnectLocalWallet } from "./ReconnectLocalWallet";
import { Flex } from "../../../components/basic";
import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { LocalConfiguredWallet } from "./types";
import { useLocalWalletInfo } from "./useLocalWalletInfo";

type LocalWalletConnectUIProps = ConnectUIProps & {
  localWallet: LocalConfiguredWallet;
};

export const LocalWalletConnectUI = (props: LocalWalletConnectUIProps) => {
  const { walletData } = useLocalWalletInfo(props.localWallet);

  if (!props.localWallet.config.persist) {
    return (
      <CreateLocalWallet_Guest
        localWallet={props.localWallet}
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
        localWallet={props.localWallet}
      />
    );
  }

  return (
    <CreateLocalWallet_Password
      goBack={props.goBack}
      localWallet={props.localWallet}
      onConnect={props.close}
    />
  );
};
