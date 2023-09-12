import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Container,
  Flex,
  ModalHeader,
  ScreenBottomContainer,
} from "../../../components/basic";
import { Spinner } from "../../../components/Spinner";
import { PaperWallet } from "@thirdweb-dev/wallets";
import { Text } from "../../../components/text";
import { Spacer } from "../../../components/Spacer";
import { iconSize } from "../../../design-system";
import { Button } from "../../../components/buttons";
import { HelperLink, ModalTitle } from "../../../components/modalElements";
import { GoogleIcon } from "../../ConnectWallet/icons/GoogleIcon";

export const PaperGoogleLogin = ({
  close,
  walletConfig,
  goBack,
  modalSize,
}: ConnectUIProps<PaperWallet>) => {
  const connect = useConnect();
  const prompted = useRef(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "failed">(
    "idle",
  );

  const googleLogin = useCallback(async () => {
    setStatus("connecting");
    try {
      await connect(walletConfig, { googleLogin: true });
      close();
    } catch (e) {
      setStatus("failed");
      console.error(e);
    }
  }, [close, connect, walletConfig]);

  useEffect(() => {
    if (prompted.current) {
      return;
    }
    prompted.current = true;
    googleLogin();
  }, [googleLogin]);

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
            <Flex justifyContent="center" alignItems="center" gap="xs">
              <GoogleIcon size={iconSize.md} />
              <ModalTitle> Sign in </ModalTitle>
            </Flex>
          }
          onBack={goBack}
        />
        {modalSize === "compact" ? <Spacer y="xxl" /> : null}
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
          {status === "connecting" && (
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
              <Flex justifyContent="center">
                <Spinner size="lg" color="accentText" />
              </Flex>

              <Spacer y="xxl" />
            </>
          )}
          {status === "failed" && (
            <>
              <Text color="danger">Failed to sign in</Text>
              <Spacer y="lg" />
              <Button variant="inverted" onClick={googleLogin}>
                {" "}
                Retry{" "}
              </Button>
              <Spacer y="xxl" />
            </>
          )}
        </div>
      </Container>

      <ScreenBottomContainer
        style={{
          borderTop: modalSize === "wide" ? "none" : undefined,
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Text size="sm" multiline>
            Make sure you have enabled <br /> pop-ups for this site
          </Text>

          <Spacer y="sm" />

          <Text size="sm" multiline>
            The option to enable pop-ups can <br /> be found in {`browser's`}{" "}
            address bar
          </Text>

          <Spacer y="sm" />

          <Text size="sm" multiline>
            Once you have enabled pop-ups, <br />
            click on{" "}
            <HelperLink
              onClick={googleLogin}
              style={{
                display: "inline",
              }}
            >
              Retry
            </HelperLink>
            to try again.
          </Text>
        </div>
      </ScreenBottomContainer>
    </Container>
  );
};
