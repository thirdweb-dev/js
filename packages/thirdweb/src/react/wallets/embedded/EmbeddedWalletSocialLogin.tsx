import { useState, useEffect } from "react";
import { useTWLocale } from "../../providers/locale-provider.js";
import type { ConnectUIProps } from "../../types/wallets.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { useCustomTheme } from "../../ui/design-system/CustomThemeProvider.js";
import { openOauthSignInWindow } from "./openOauthSignInWindow.js";
import type {
  EmbeddedWalletSelectUIState,
  EmbeddedWalletSocialAuth,
} from "./types.js";
import type { EmbeddedWallet } from "../../../wallets/embedded/core/wallet/index.js";
import { Text } from "../../ui/components/text.js";

/**
 * @internal
 */
export function EmbeddedWalletSocialLogin(props: {
  connectUIProps: ConnectUIProps;
  socialAuth: EmbeddedWalletSocialAuth;
  state: EmbeddedWalletSelectUIState;
}) {
  const ewLocale = useTWLocale().wallets.embeddedWallet;
  const locale = ewLocale.socialLoginScreen;
  const themeObj = useCustomTheme();
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const { createInstance, done, chain } = props.connectUIProps.connection;
  const [isConnecting, setIsConnecting] = useState(false);
  const { goBack, size } = props.connectUIProps.screenConfig;

  const handleSocialLogin = async () => {
    try {
      const wallet = createInstance() as EmbeddedWallet;
      const socialWindow = openOauthSignInWindow(props.socialAuth, themeObj);

      if (!socialWindow) {
        throw new Error(`Failed to open ${props.socialAuth} login window`);
      }

      await wallet.connect({
        chain,
        strategy: props.socialAuth,
        openedWindow: socialWindow,
        closeOpenedWindow: (openedWindow) => {
          openedWindow.close();
        },
      });

      done(wallet);
    } catch (e: any) {
      // TODO this only happens on 'retry' button click, not on initial login
      // should pass auth error message to this component
      if (e?.message?.includes("PAYMENT_METHOD_REQUIRED")) {
        setAuthError(ewLocale.maxAccountsExceeded);
      }
      console.error(`Error sign in with ${props.socialAuth}`, e);
    }
  };

  const { setModalVisibility } = props.connectUIProps.screenConfig;
  const socialLogin = props.state?.socialLogin;

  useEffect(() => {
    if (socialLogin) {
      setIsConnecting(true);
      socialLogin.connectionPromise
        .then(() => {
          done(socialLogin.wallet);
        })
        .catch(() => {
          setIsConnecting(false);
        });
    }
  }, [done, setModalVisibility, socialLogin]);

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

        {size === "compact" ? <Spacer y="xl" /> : null}

        <Container
          flex="column"
          center="both"
          expand
          style={{
            textAlign: "center",
            minHeight: "250px",
          }}
        >
          {isConnecting && (
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

          {!isConnecting && (
            <Container animate="fadein">
              <Text color="danger">{locale.failed}</Text>
              {authError && <Text color="danger">{authError}</Text>}
              <Spacer y="lg" />
              <Button variant="primary" onClick={handleSocialLogin}>
                {locale.retry}
              </Button>
              <Spacer y="xxl" />
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  );
}
