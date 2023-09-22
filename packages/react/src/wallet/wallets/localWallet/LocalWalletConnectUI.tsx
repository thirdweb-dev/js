import { Spinner } from "../../../components/Spinner";
import {
  CreateLocalWallet_Guest,
  CreateLocalWallet_Password,
} from "./CreateLocalWallet";
import { ReconnectLocalWallet } from "./ReconnectLocalWallet";
import { Container } from "../../../components/basic";
import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import type { LocalWallet } from "@thirdweb-dev/wallets";

export const LocalWalletConnectUI = (
  props: ConnectUIProps<LocalWallet> & { persist: boolean },
) => {
  const { walletData } = useLocalWalletInfo(props.walletConfig, props.persist);

  if (!props.persist) {
    return (
      <CreateLocalWallet_Guest
        persist={props.persist}
        localWallet={props.walletConfig}
        goBack={props.goBack}
        onConnect={props.connected}
      />
    );
  }

  if (walletData === "loading") {
    return (
      <Container
        flex="row"
        center="both"
        style={{
          height: "300px",
        }}
      >
        <Spinner size="lg" color="accentText" />
      </Container>
    );
  }

  if (walletData) {
    return (
      <ReconnectLocalWallet
        modalSize={props.modalSize}
        renderBackButton={props.supportedWallets.length > 1}
        supportedWallets={props.supportedWallets}
        onConnect={props.connected}
        goBack={props.goBack}
        localWallet={props.walletConfig}
        persist={props.persist}
      />
    );
  }

  return (
    <CreateLocalWallet_Password
      goBack={props.goBack}
      localWalletConf={props.walletConfig}
      onConnect={props.connected}
      renderBackButton={props.supportedWallets.length > 1}
      persist={props.persist}
    />
  );
};
