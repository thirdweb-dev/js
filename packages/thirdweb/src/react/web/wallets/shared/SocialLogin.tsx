"use client";
import { useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { InAppWalletSocialAuth } from "../../../../wallets/in-app/core/wallet/types.js";
import { linkProfile } from "../../../../wallets/in-app/web/lib/auth/index.js";
import { loginWithOauthRedirect } from "../../../../wallets/in-app/web/lib/auth/oauth.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { setLastAuthProvider } from "../../../core/utils/storage.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Text } from "../../ui/components/text.js";
import type { ConnectWalletSelectUIState } from "./ConnectWalletSocialOptions.js";
import type { InAppWalletLocale } from "./locale/types.js";
import { openOauthSignInWindow } from "./oauthSignIn.js";

/**
 * @internal
 */
export function SocialLogin(props: {
  socialAuth: InAppWalletSocialAuth;
  locale: InAppWalletLocale;
  wallet: Wallet;
  done: () => void;
  goBack?: () => void;
  state: ConnectWalletSelectUIState;
  size: "compact" | "wide";
  client: ThirdwebClient;
  chain: Chain | undefined;
  connectLocale: ConnectLocale;
  isLinking?: boolean;
}) {
  const ewLocale = props.locale;
  const locale = ewLocale.socialLoginScreen;
  const themeObj = useCustomTheme();
  const ecosystem = isEcosystemWallet(props.wallet)
    ? {
        id: props.wallet.id,
        partnerId: props.wallet.getConfig()?.partnerId,
      }
    : undefined;

  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const { done, wallet } = props;
  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting",
  );

  const handleSocialLogin = async () => {
    const walletConfig = wallet.getConfig();
    const authMode =
      walletConfig && "auth" in walletConfig
        ? (walletConfig?.auth?.mode ?? "popup")
        : "popup";

    if (
      walletConfig &&
      "auth" in walletConfig &&
      authMode !== "popup" &&
      !props.isLinking // Redirect not supported for account linking (we need to maintain the aplication state)
    ) {
      return loginWithOauthRedirect({
        authOption: props.socialAuth,
        client: props.client,
        ecosystem,
        redirectUrl: walletConfig?.auth?.redirectUrl,
        mode: walletConfig?.auth?.mode,
      });
    }

    try {
      const socialWindow = openOauthSignInWindow({
        authOption: props.socialAuth,
        themeObj,
        client: props.client,
        ecosystem,
      });

      if (!socialWindow) {
        throw new Error(`Failed to open ${props.socialAuth} login window`);
      }

      setStatus("connecting");
      if (props.isLinking) {
        await linkProfile({
          client: props.client,
          strategy: props.socialAuth,
          openedWindow: socialWindow,
          closeOpenedWindow: (openedWindow) => {
            openedWindow.close();
          },
          ecosystem,
        }).catch((e) => {
          setAuthError(e.message);
          throw e;
        });
      } else {
        await wallet.connect({
          chain: props.chain,
          strategy: props.socialAuth,
          openedWindow: socialWindow,
          closeOpenedWindow: (openedWindow) => {
            openedWindow.close();
          },
          client: props.client,
        });
      }

      await setLastAuthProvider(props.socialAuth, webLocalStorage);
      setStatus("connected");
      done();
    } catch (e) {
      setStatus("error");
      // TODO this only happens on 'retry' button click, not on initial login
      // should pass auth error message to this component
      if (
        e instanceof Error &&
        e?.message?.includes("PAYMENT_METHOD_REQUIRED")
      ) {
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
        .catch((e) => {
          setAuthError(e.message);
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
        {props.goBack && (
          <ModalHeader
            title={
              props.isLinking
                ? props.connectLocale.manageWallet.linkProfile
                : locale.title
            }
            onBack={props.goBack}
          />
        )}

        {props.size === "compact" ? <Spacer y="xl" /> : null}

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
              {authError ? (
                <Text center color="danger">
                  {authError}
                </Text>
              ) : (
                <Text color="danger">{locale.failed}</Text>
              )}
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
