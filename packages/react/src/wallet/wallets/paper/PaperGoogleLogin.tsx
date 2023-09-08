import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Flex,
  ModalHeader,
  ScreenBottomContainer,
  ScreenContainer,
} from "../../../components/basic";
import { Spinner } from "../../../components/Spinner";
import { PaperWallet } from "@thirdweb-dev/wallets";
import {
  DangerText,
  NeutralText,
  SecondaryText,
} from "../../../components/text";
import { Spacer } from "../../../components/Spacer";
import { fontSize, iconSize } from "../../../design-system";
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
    <>
      <ScreenContainer
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
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
              <NeutralText
                style={{
                  lineHeight: 1.5,
                  maxWidth: "250px",
                }}
              >
                Select your Google account in the pop-up
              </NeutralText>
              <Spacer y="xl" />
              <Flex justifyContent="center">
                <Spinner size="lg" color="accent" />
              </Flex>

              <Spacer y="xxl" />
            </>
          )}
          {status === "failed" && (
            <>
              <DangerText>Failed to sign in</DangerText>
              <Spacer y="lg" />
              <Button variant="inverted" onClick={googleLogin}>
                {" "}
                Retry{" "}
              </Button>
              <Spacer y="xxl" />
            </>
          )}
        </div>
      </ScreenContainer>

      <ScreenBottomContainer>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <SecondaryText
            style={{
              lineHeight: 1.5,
              fontSize: fontSize.sm,
            }}
          >
            Make sure you have enabled <br /> pop-ups for this site
          </SecondaryText>

          <Spacer y="sm" />

          <SecondaryText
            style={{
              lineHeight: 1.5,
              fontSize: fontSize.sm,
            }}
          >
            The option to enable pop-ups can <br /> be found in {`browser's`}{" "}
            address bar
          </SecondaryText>

          <Spacer y="sm" />

          <SecondaryText
            style={{
              lineHeight: 1.5,
              fontSize: fontSize.sm,
            }}
          >
            Once you have enabled pop-ups, <br />
            click on{" "}
            <HelperLink
              onClick={googleLogin}
              style={{
                display: "inline",
              }}
            >
              {" "}
              Retry
            </HelperLink>{" "}
            to try again.
          </SecondaryText>
        </div>
      </ScreenBottomContainer>
    </>
  );
};
