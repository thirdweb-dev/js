"use client";
import { useEffect, useRef, useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { setLastAuthProvider } from "../../../core/utils/storage.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Text } from "../../ui/components/text.js";
import type { ConnectWalletSelectUIState } from "./ConnectWalletSocialOptions.js";
import type { InAppWalletLocale } from "./locale/types.js";

/**
 * @internal
 */
export function GuestLogin(props: {
  locale: InAppWalletLocale;
  wallet: Wallet;
  done: () => void;
  goBack?: () => void;
  state: ConnectWalletSelectUIState;
  size: "compact" | "wide";
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
}) {
  const ewLocale = props.locale;
  const locale = ewLocale.socialLoginScreen;

  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const { done, wallet } = props;
  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting",
  );

  const handleGuestLogin = async () => {
    const connectOptions = {
      client: props.client,
      ecosystem: isEcosystemWallet(wallet)
        ? {
            id: wallet.id,
            partnerId: wallet.getConfig()?.partnerId,
          }
        : undefined,
      strategy: "guest" as const,
    };
    try {
      await wallet.connect(connectOptions);
      await setLastAuthProvider("guest", webLocalStorage);

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
      console.error("Error generating guest account", e);
    }
  };

  const guestLogin = props.state?.guestLogin;

  const socialLoginStarted = useRef(false);
  useEffect(() => {
    if (socialLoginStarted.current) {
      return;
    }

    if (guestLogin) {
      socialLoginStarted.current = true;
      setStatus("connecting");
      guestLogin.connectionPromise
        .then(() => {
          done();
          setStatus("connected");
        })
        .catch((e) => {
          setAuthError(e.message);
          setStatus("error");
        });
    }
  }, [done, guestLogin]);

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
          <ModalHeader title={locale.title} onBack={props.goBack} />
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
                Generating your guest account
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
              <Button variant="primary" onClick={handleGuestLogin}>
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
