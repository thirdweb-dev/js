import {
  ConnectUIProps,
  useConnectionStatus,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { PaperWallet } from "@thirdweb-dev/wallets";
import { useEffect } from "react";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { ModalTitle } from "../../../components/modalElements";
import { Text } from "../../../components/text";
import { Theme, iconSize } from "../../../design-system";
import { GoogleIcon } from "../../ConnectWallet/icons/GoogleIcon";
import { openGoogleSignInWindow } from "../../utils/openGoogleSignInWindow";
import { useTheme } from "@emotion/react";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const PaperGoogleLogin = (props: ConnectUIProps<PaperWallet>) => {
  const { goBack, modalSize, connected } = props;

  const locale = useTWLocale().wallets.paperWallet.googleLogin;
  const createWalletInstance = useCreateWalletInstance();
  const setConnectionStatus = useSetConnectionStatus();
  const setConnectedWallet = useSetConnectedWallet();
  const connectionStatus = useConnectionStatus();
  const themeObj = useTheme() as Theme;

  // Need to trigger google login on button click to avoid popup from being blocked
  const googleLogin = async () => {
    try {
      const paperWallet = createWalletInstance(props.walletConfig);
      setConnectionStatus("connecting");
      const googleWindow = openGoogleSignInWindow(themeObj);
      if (!googleWindow) {
        throw new Error("Failed to open google login window");
      }

      await paperWallet.connect({
        googleLogin: {
          openedWindow: googleWindow,
          closeOpenedWindow: (openedWindow) => {
            openedWindow.close();
          },
        },
      });
      setConnectedWallet(paperWallet);
      props.connected();
    } catch (e) {
      setConnectionStatus("disconnected");
      console.error(e);
    }
  };

  useEffect(() => {
    if (connectionStatus === "connected") {
      connected();
    }
  }, [connectionStatus, connected]);

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
              <ModalTitle> {locale.title} </ModalTitle>
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
                {locale.instruction}
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
              <Text color="danger">{locale.failed}</Text>
              <Spacer y="lg" />
              <Button variant="primary" onClick={googleLogin}>
                {locale.retry}
              </Button>
              <Spacer y="xxl" />
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  );
};
