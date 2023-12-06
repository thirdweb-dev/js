import { ConnectUIProps, WalletInstance } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container, ModalHeader } from "../../components/basic";
import { Spinner } from "../../components/Spinner";
import { Text } from "../../components/text";
import { Button } from "../../components/buttons";
import { Spacer } from "../../components/Spacer";
import { wait } from "../../utils/wait";

export const HeadlessConnectUI = <T extends WalletInstance>(
  props: ConnectUIProps<T>,
) => {
  const {
    connected,
    hide,
    show,
    connect,
    setConnectionStatus,
    supportedWallets,
  } = props;

  const prompted = useRef(false);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const showBack = supportedWallets.length > 1;

  const handleConnect = useCallback(async () => {
    setConnectionFailed(false);
    try {
      setConnectionStatus("connecting");
      await wait(1000);
      hide();
      await connect();
      connected();
    } catch (e) {
      setConnectionStatus("disconnected");
      setConnectionFailed(true);
      show();
      console.error(e);
    }
  }, [connect, connected, hide, show, setConnectionStatus]);

  useEffect(() => {
    if (prompted.current) {
      return;
    }
    prompted.current = true;
    handleConnect();
  }, [handleConnect]);

  let content = null;

  if (connectionFailed) {
    content = (
      <>
        <Text color="danger">{"Failed to connect"}</Text>
        <Spacer y="lg" />
        <Button variant="primary" onClick={handleConnect}>
          {"Try again"}
        </Button>
      </>
    );
  } else {
    content = <Spinner size="lg" color="accentText" />;
  }

  return (
    <Container p="lg">
      <ModalHeader
        onBack={showBack ? props.goBack : undefined}
        title={props.walletConfig.meta.name}
        imgSrc={props.walletConfig.meta.iconURL}
      />
      <Container
        flex="column"
        center="both"
        style={{
          minHeight: "250px",
        }}
      >
        {content}
      </Container>
    </Container>
  );
};
