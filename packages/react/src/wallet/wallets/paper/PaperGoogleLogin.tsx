import {
  ConnectUIProps,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { useState } from "react";
import { Container, ModalHeader } from "../../../components/basic";
import { Spinner } from "../../../components/Spinner";
import { PaperWallet } from "@thirdweb-dev/wallets";
import { Text } from "../../../components/text";
import { Spacer } from "../../../components/Spacer";
import { iconSize } from "../../../design-system";
import { Button } from "../../../components/buttons";
import { ModalTitle } from "../../../components/modalElements";
import { GoogleIcon } from "../../ConnectWallet/icons/GoogleIcon";

export const PaperGoogleLogin = ({
  close,
  walletConfig,
  goBack,
}: ConnectUIProps<PaperWallet>) => {
  const createWalletInstance = useCreateWalletInstance();
  const setConnectionStatus = useSetConnectionStatus();
  const setConnectedWallet = useSetConnectedWallet();
  const [UIStatus, setUIStatus] = useState<"idle" | "connecting" | "failed">(
    "idle",
  );

  const googleLogin = async () => {
    try {
      const paper = createWalletInstance(walletConfig);
      setUIStatus("connecting");
      setConnectionStatus("connecting");
      await paper.connect({ googleLogin: true });
      setConnectedWallet(paper);
      close();
    } catch (e) {
      setConnectionStatus("disconnected");
      setUIStatus("failed");
      console.error(e);
    }
  };

  return (
    <Container
      animate="fadein"
      flex="column"
      fullHeight
      p="lg"
      style={{
        minHeight: "350px",
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {UIStatus === "idle" && (
          <Container p="xl" flex="row" center="x">
            <Button onClick={googleLogin} variant="primary">
              Sign in
            </Button>
          </Container>
        )}

        {UIStatus === "connecting" && (
          <>
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
          </>
        )}
        {UIStatus === "failed" && (
          <>
            <Text color="danger">Failed to sign in</Text>
            <Spacer y="lg" />
            <Button variant="primary" onClick={googleLogin}>
              {" "}
              Retry{" "}
            </Button>
            <Spacer y="xxl" />
          </>
        )}
      </div>
    </Container>
  );
};
