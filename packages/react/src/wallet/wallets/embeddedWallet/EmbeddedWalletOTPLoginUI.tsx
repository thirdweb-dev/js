import styled from "@emotion/styled";
import { ConnectUIProps, useWalletContext } from "@thirdweb-dev/react-core";
import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeIn } from "../../../components/FadeIn";
import { OTPInput } from "../../../components/OTPInput";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { Theme, fontSize } from "../../../design-system";

type PaperOTPLoginUIProps = ConnectUIProps<EmbeddedWallet>;

type SentEmailInfo = {
  isNewDevice: boolean;
  isNewUser: boolean;
};

export const EmbeddedWalletOTPLoginUI: React.FC<PaperOTPLoginUIProps> = (
  props,
) => {
  const email = props.selectionData;
  const [otpInput, setOtpInput] = useState("");
  const { createWalletInstance, setConnectedWallet } = useWalletContext();

  const [wallet, setWallet] = useState<EmbeddedWallet | null>(null);

  const [verifyStatus, setVerifyStatus] = useState<
    "verifying" | "invalid" | "valid" | "idle"
  >("idle");

  const [sentEmailInfo, setSentEmailInfo] = useState<
    SentEmailInfo | null | "error"
  >(null);

  const recoveryCodeRequired = false;

  const sendEmail = useCallback(async () => {
    setOtpInput("");
    setVerifyStatus("idle");
    setSentEmailInfo(null);

    try {
      const _wallet = createWalletInstance(props.walletConfig);
      setWallet(_wallet);
      const _embeddedWalletSdk = await _wallet.getEmbeddedWalletSDK();

      const { isNewDevice, isNewUser } =
        await _embeddedWalletSdk.auth.sendEmailLoginOtp({
          email: email,
        });

      setSentEmailInfo({ isNewDevice, isNewUser });
    } catch (e) {
      debugger;
      console.error(e);
      setVerifyStatus("idle");
      setSentEmailInfo("error");
    }
  }, [createWalletInstance, email, props.walletConfig]);

  const handleSubmit = () => {
    if (!sentEmailInfo || otpInput.length !== 6) {
      return;
    }

    verifyCodes();
  };

  const verifyCodes = async () => {
    setVerifyStatus("idle");

    if (!wallet) {
      return;
    }

    try {
      setVerifyStatus("verifying");
      await wallet.connect({
        email,
        otp: otpInput,
      });

      setConnectedWallet(wallet);
      setVerifyStatus("valid");
      props.close();
    } catch (e) {
      setVerifyStatus("invalid");
      console.error(e);
    }
  };

  // send email on mount
  const emailSentOnMount = useRef(false);
  useEffect(() => {
    if (!emailSentOnMount.current) {
      emailSentOnMount.current = true;
      sendEmail();
    }
  }, [sendEmail]);

  return (
    <Container fullHeight flex="column" p="lg" animate="fadein">
      <ModalHeader title="Sign in" onBack={props.goBack} />

      <Container expand flex="column" center="y">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Spacer y="xxl" />
            <Text>Enter the OTP sent to</Text>
            <Spacer y="sm" />
            <Text color="primaryText">{email}</Text>
            <Spacer y="xl" />
          </div>

          <OTPInput
            isInvalid={verifyStatus === "invalid"}
            digits={6}
            value={otpInput}
            setValue={(value) => {
              setOtpInput(value);
              setVerifyStatus("idle");
            }}
            onEnter={handleSubmit}
          />

          {verifyStatus === "invalid" && (
            <FadeIn>
              <Spacer y="sm" />
              <Container flex="row" center="x">
                <Text size="sm" color="danger">
                  Invalid OTP {recoveryCodeRequired ? "or recovery code" : ""}
                </Text>
              </Container>
            </FadeIn>
          )}

          <Spacer y="xl" />

          {verifyStatus === "verifying" ? (
            <>
              <Spacer y="md" />
              <Container flex="row" center="x">
                <Spinner size="md" color="accentText" />
              </Container>
              <Spacer y="md" />
            </>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="accent"
              type="submit"
              style={{
                width: "100%",
              }}
            >
              Verify
            </Button>
          )}

          <Spacer y="lg" />

          {sentEmailInfo === "error" && (
            <>
              <Text size="sm" center color="danger">
                Failed to send OTP
              </Text>
              <Spacer y="md" />
            </>
          )}

          {!sentEmailInfo && (
            <Container
              flex="row"
              center="both"
              gap="xs"
              style={{
                textAlign: "center",
              }}
            >
              <Text size="sm">Sending OTP</Text>
              <Spinner size="xs" color="secondaryText" />
            </Container>
          )}

          {sentEmailInfo && (
            <LinkButton onClick={sendEmail} type="button">
              Resend OTP
            </LinkButton>
          )}
        </form>
      </Container>
    </Container>
  );
};

const LinkButton = styled.button<{ theme?: Theme }>`
  all: unset;
  color: ${(p) => p.theme.colors.accentText};
  font-size: ${fontSize.sm};
  cursor: pointer;
  text-align: center;
  width: 100%;
  &:hover {
    color: ${(p) => p.theme.colors.primaryText};
  }
`;
