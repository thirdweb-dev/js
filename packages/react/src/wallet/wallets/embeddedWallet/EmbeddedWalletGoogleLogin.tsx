import {
  ConnectUIProps,
  useConnectionStatus,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import { useEffect } from "react";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { ModalTitle } from "../../../components/modalElements";
import { Text } from "../../../components/text";
import { iconSize } from "../../../design-system";
import { GoogleIcon } from "../../ConnectWallet/icons/GoogleIcon";

export const EmbeddedWalletGoogleLogin = (
  props: ConnectUIProps<EmbeddedWallet>,
) => {
  const { goBack, modalSize } = props;
  const createWalletInstance = useCreateWalletInstance();
  const setConnectionStatus = useSetConnectionStatus();
  const setConnectedWallet = useSetConnectedWallet();
  const connectionStatus = useConnectionStatus();

  const googleLogin = async () => {
    try {
      const embeddedWallet = createWalletInstance(props.walletConfig);
      setConnectionStatus("connecting");
      const googleWindow = window.open("", "Login", "width=350, height=500");
      if (!googleWindow) {
        throw new Error("Failed to open google login window");
      }

      await embeddedWallet.connect({
        loginType: "headless_google_oauth",
        openedWindow: googleWindow,
        closeOpenedWindow: (openedWindow) => {
          openedWindow.close();
        },
      });

      setConnectedWallet(embeddedWallet);
      props.connected();
    } catch (e) {
      setConnectionStatus("disconnected");
      console.error("Error logging into google", e);
    }
  };

  const closeModal = props.connected;

  useEffect(() => {
    if (connectionStatus === "connected") {
      closeModal();
    }
  }, [connectionStatus, closeModal]);

  return (
    <Container animate="fadein" flex="column" fullHeight>
      <Container
        flex="column"
        expand
        p="lg"
        style={{
          paddingBottom: 0,
        }}
      >
        <ModalHeader
          title={
            <Container flex="row" center="both" gap="xs">
              <GoogleIcon size={iconSize.md} />
              <ModalTitle> Sign in </ModalTitle>
            </Container>
          }
          onBack={goBack}
        />

        {modalSize === "compact" ? <Spacer y="xl" /> : null}

        <Container
          flex="column"
          center="both"
          expand
          style={{
            textAlign: "center",
            minHeight: "250px",
          }}
        >
          {connectionStatus === "connecting" && (
            <Container animate="fadein">
              <Text
                color="primaryText"
                multiline
                style={{
                  maxWidth: "250px",
                }}
              >
                Select your Google account in the pop-up
              </Text>
              <Spacer y="xl" />
              <Container center="x" flex="row">
                <Spinner size="lg" color="accentText" />
              </Container>

              <Spacer y="xxl" />
            </Container>
          )}

          {connectionStatus === "disconnected" && (
            <Container animate="fadein">
              <Text color="danger">Failed to sign in</Text>
              <Spacer y="lg" />
              <Button variant="primary" onClick={googleLogin}>
                {" "}
                Retry{" "}
              </Button>
              <Spacer y="xxl" />
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  );
};
