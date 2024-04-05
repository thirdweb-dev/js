import { useState, useEffect, useContext, useRef } from "react";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { useCustomTheme } from "../../ui/design-system/CustomThemeProvider.js";
import { openOauthSignInWindow } from "./openOauthSignInWindow.js";
import type { EmbeddedWalletSelectUIState } from "./types.js";
import { Text } from "../../ui/components/text.js";
import type { EmbeddedWalletLocale } from "./locale/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { ModalConfigCtx } from "../../providers/wallet-ui-states-provider.js";
import type { EmbeddedWalletSocialAuth } from "../../../../wallets/embedded/core/wallet/index.js";

/**
 * @internal
 */
export function EmbeddedWalletSocialLogin(props: {
  socialAuth: EmbeddedWalletSocialAuth;
  locale: EmbeddedWalletLocale;
  wallet: Wallet<"inApp">;
  done: () => void;
  goBack?: () => void;
  state: EmbeddedWalletSelectUIState;
}) {
  const ewLocale = props.locale;
  const locale = ewLocale.socialLoginScreen;
  const themeObj = useCustomTheme();
  const { modalSize } = useContext(ModalConfigCtx);
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const { done, wallet } = props;
  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting",
  );
  const { client, chain } = useWalletConnectionCtx();

  const handleSocialLogin = async () => {
    try {
      const socialWindow = openOauthSignInWindow(props.socialAuth, themeObj);

      if (!socialWindow) {
        throw new Error(`Failed to open ${props.socialAuth} login window`);
      }

      setStatus("connecting");
      await wallet.connect({
        chain,
        strategy: props.socialAuth,
        openedWindow: socialWindow,
        closeOpenedWindow: (openedWindow) => {
          openedWindow.close();
        },
        client,
      });
      setStatus("connected");
      done();
    } catch (e: any) {
      setStatus("error");
      // TODO this only happens on 'retry' button click, not on initial login
      // should pass auth error message to this component
      if (e?.message?.includes("PAYMENT_METHOD_REQUIRED")) {
        setAuthError(ewLocale.maxAccountsExceeded);
      }
      console.error(`Error sign in with ${props.socialAuth}`, e);
    }
  };

  // const { setModalVisibility } = props.connectUIProps.screenConfig;
  const socialLogin = props.state?.socialLogin;

  const socialLoginStarted = useRef(false);
  useEffect(() => {
    if (socialLoginStarted.current) {
      return;
    }

    if (socialLogin) {
      socialLoginStarted.current = true;
      setStatus("connecting");
      socialLogin.connectionPromise
        .then(() => {
          done();
          setStatus("connected");
        })
        .catch(() => {
          setStatus("error");
        });
    }
  }, [done, socialLogin]);

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
        <ModalHeader title={locale.title} onBack={props.goBack} />

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
          {status !== "error" && (
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

          {status === "error" && (
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
