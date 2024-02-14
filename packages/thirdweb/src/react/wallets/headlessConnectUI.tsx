import { useRef, useState, useCallback, useEffect } from "react";
import type { ConnectUIProps } from "../types/wallets.js";
import { Spacer } from "../ui/components/Spacer.js";
import { Spinner } from "../ui/components/Spinner.js";
import { Container, ModalHeader } from "../ui/components/basic.js";
import { Button } from "../ui/components/buttons.js";
import { wait } from "../utils/wait.js";
import { Text } from "../ui/components/text.js";

/**
 *
 * @internal
 */
export const HeadlessConnectUI = (props: ConnectUIProps) => {
  const { walletConfig, screenConfig, done, createInstance } = props;

  const prompted = useRef(false);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const { setModalVisibility } = screenConfig;

  const handleConnect = useCallback(async () => {
    setConnectionFailed(false);
    try {
      await wait(1000);
      setModalVisibility(false);
      const wallet = createInstance();
      await wallet.connect();
      setModalVisibility(true);
      done(wallet);
    } catch (e) {
      setConnectionFailed(true);
      setModalVisibility(true);
      console.error(e);
    }
  }, [createInstance, done, setModalVisibility]);

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
    content = <Spinner size="xl" color="accentText" />;
  }

  return (
    <Container p="lg">
      <ModalHeader
        onBack={screenConfig.goBack}
        title={walletConfig.metadata.name}
        imgSrc={walletConfig.metadata.iconUrl}
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
