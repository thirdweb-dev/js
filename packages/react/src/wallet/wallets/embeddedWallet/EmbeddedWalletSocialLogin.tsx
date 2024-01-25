import { ConnectUIProps } from "@thirdweb-dev/react-core";
import {
  EmbeddedWallet,
  EmbeddedWalletOauthStrategy,
} from "@thirdweb-dev/wallets";
import { useEffect, useState } from "react";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { openOauthSignInWindow } from "../../utils/openOauthSignInWindow";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";

export const EmbeddedWalletSocialLogin = (
  props: ConnectUIProps<EmbeddedWallet> & {
    strategy: EmbeddedWalletOauthStrategy;
  },
) => {
  const ewLocale = useTWLocale().wallets.embeddedWallet;
  const locale = ewLocale.socialLoginScreen;
  const {
    goBack,
    modalSize,
    createWalletInstance,
    setConnectionStatus,
    setConnectedWallet,
    connectionStatus,
  } = props;
  const themeObj = useCustomTheme();
  const [authError, setAuthError] = useState<string | undefined>(undefined);

  const socialLogin = async () => {
    try {
      console.log("socialLogin");
      const embeddedWallet = createWalletInstance();
      setConnectionStatus("connecting");
      const socialWindow = openOauthSignInWindow(props.strategy, themeObj);
      if (!socialWindow) {
        throw new Error(`Failed to open ${props.strategy} login window`);
      }
      const authResult = await embeddedWallet.authenticate({
        strategy: props.strategy,
        openedWindow: socialWindow,
        closeOpenedWindow: (openedWindow) => {
          openedWindow.close();
        },
      });
      await embeddedWallet.connect({
        authResult,
      });
      setConnectedWallet(embeddedWallet);
      props.connected();
    } catch (e: any) {
      // TODO this only happens on 'retry' button click, not on initial login
      // should pass auth error message to this component
      if (e?.message?.includes("PAYMENT_METHOD_REQUIRED")) {
        setAuthError(ewLocale.maxAccountsExceeded);
      }
      setConnectionStatus("disconnected");
      console.error(`Error sign in with ${props.strategy}`, e);
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
        <ModalHeader title={locale.title} onBack={goBack} />

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
                center
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
              {authError && <Text color="danger">{authError}</Text>}
              <Spacer y="lg" />
              <Button variant="primary" onClick={socialLogin}>
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
