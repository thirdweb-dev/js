import { useCallback, useEffect, useRef, useState } from "react";
import type { Wallet } from "../../../../exports/wallets.js";
import { hasStoredPasskey } from "../../../../wallets/in-app/implementations/lib/auth/passkeys.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { AccentFailIcon } from "../../ui/ConnectWallet/icons/AccentFailIcon.js";
import { FingerPrintIcon } from "../../ui/ConnectWallet/icons/FingerPrintIcon.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Text } from "../../ui/components/text.js";
import { iconSize } from "../../ui/design-system/index.js";

export function InAppWalletPassKeyLogin(props: {
  wallet: Wallet<"inApp">;
  done: () => void;
  onBack?: () => void;
}) {
  const { client, connectModal } = useConnectUI();
  const { wallet, done } = props;
  const [status, setStatus] = useState<"loading" | "error">("loading");

  const loginOrSignup = useCallback(async () => {
    const isPassKeyStored = await hasStoredPasskey(client);
    setStatus("loading");
    try {
      if (isPassKeyStored) {
        // login
        await wallet.connect({
          client: client,
          strategy: "passkey",
          type: "sign-in",
        });
        done();
      } else {
        // signup
        await wallet.connect({
          client: client,
          strategy: "passkey",
          type: "sign-up",
        });
        done();
      }
    } catch {
      setStatus("error");
    }
  }, [wallet, client, done]);

  const triggered = useRef(false);
  useEffect(() => {
    if (triggered.current) {
      return;
    }

    triggered.current = true;
    loginOrSignup();
  }, [loginOrSignup]);

  return (
    <Container animate="fadein" fullHeight flex="column">
      <Container p="lg">
        <ModalHeader title="Passkey" onBack={props.onBack} />
      </Container>

      <Container
        px={connectModal.size === "wide" ? "xxl" : "lg"}
        expand
        flex="column"
        center="y"
      >
        <div>
          {status === "loading" && (
            <Container animate="fadein">
              <Spacer y="xxl" />
              <Container
                flex="row"
                center="x"
                style={{
                  position: "relative",
                }}
              >
                <Spinner size="4xl" color="accentText" />
                <Container
                  color="accentText"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <FingerPrintIcon size={iconSize.xxl} />
                </Container>
              </Container>
              <Spacer y="xl" />
              <Text center color="primaryText" size="lg">
                Requesting Passkey
              </Text>
              <Spacer y="md" />
              <Text multiline center>
                A pop-up prompt will appear to sign-in and verify your passkey.
              </Text>
              <Spacer y="xxl" />
              <Spacer y="xxl" />
            </Container>
          )}

          {status === "error" && (
            <Container animate="fadein">
              <Spacer y="xxl" />
              <Container flex="row" center="x">
                <AccentFailIcon size={iconSize["3xl"]} />
              </Container>
              <Spacer y="lg" />
              <Text center color="primaryText" size="lg">
                Failed to sign in
              </Text>
              <Spacer y="xl" />
              <Spacer y="xxl" />
              <Button variant="accent" fullWidth onClick={loginOrSignup}>
                Try Again
              </Button>
              <Spacer y="lg" />
            </Container>
          )}
        </div>
      </Container>
    </Container>
  );
}
