import styled from "@emotion/styled";
import { ConnectUIProps, useWalletContext } from "@thirdweb-dev/react-core";
import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeIn } from "../../../components/FadeIn";
import { OTPInput } from "../../../components/OTPInput";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, Line, ModalHeader } from "../../../components/basic";
import { Text } from "../../../components/text";
import { Theme, fontSize } from "../../../design-system";
import { Button } from "../../../components/buttons";

type EmbeddedWalletOTPLoginUIProps = ConnectUIProps<EmbeddedWallet>;

export const EmbeddedWalletOTPLoginUI: React.FC<
  EmbeddedWalletOTPLoginUIProps
> = (props) => {
  const email = props.selectionData;
  const [otpInput, setOtpInput] = useState("");
  const { createWalletInstance, setConnectedWallet, setConnectionStatus } =
    useWalletContext();

  const [wallet, setWallet] = useState<EmbeddedWallet | null>(null);
  const isWideModal = props.modalSize === "wide";

  const [verifyStatus, setVerifyStatus] = useState<
    "verifying" | "invalid" | "valid" | "idle"
  >("idle");

  const [sendEmailOtpStatus, setSendEmailOtpStatus] = useState<
    "sending" | "sent" | "error"
  >("sending");

  const sendEmail = useCallback(async () => {
    setOtpInput("");
    setVerifyStatus("idle");
    setSendEmailOtpStatus("sending");

    try {
      const _wallet = createWalletInstance(props.walletConfig);
      setWallet(_wallet);
      const _embeddedWalletSdk = await _wallet.getEmbeddedWalletSDK();

      await _embeddedWalletSdk.auth.sendEmailLoginOtp({
        email: email,
      });

      setSendEmailOtpStatus("sent");
    } catch (e) {
      console.error(e);
      setVerifyStatus("idle");
      setSendEmailOtpStatus("error");
    }
  }, [createWalletInstance, email, props.walletConfig]);

  const handleSubmit = (otp: string) => {
    if (sendEmailOtpStatus !== "sent" || otp.length !== 6) {
      return;
    }

    verifyCodes(otp);
  };

  const verifyCodes = async (otp: string) => {
    setVerifyStatus("idle");

    if (!wallet) {
      return;
    }

    try {
      setVerifyStatus("verifying");
      setConnectionStatus("connecting");
      await wallet.connect({
        loginType: "headless_email_otp_verification",
        email,
        otp,
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
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader title="Sign in" onBack={props.goBack} />
      </Container>

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
            {!isWideModal && <Spacer y="xl" />}
            <Text>Enter the OTP sent to</Text>
            <Spacer y="sm" />
            <Text color="primaryText">{email}</Text>
            <Spacer y="xxl" />
          </div>

          <OTPInput
            isInvalid={verifyStatus === "invalid"}
            digits={6}
            value={otpInput}
            setValue={(value) => {
              setOtpInput(value);
              setVerifyStatus("idle"); // reset error
              handleSubmit(value);
            }}
            onEnter={() => {
              handleSubmit(otpInput);
            }}
          />

          {verifyStatus === "invalid" && (
            <FadeIn>
              <Spacer y="md" />
              <Text size="sm" color="danger" center>
                Invalid OTP
              </Text>
            </FadeIn>
          )}

          <Spacer y="xxl" />

          <Container px={isWideModal ? "xxl" : "lg"}>
            {verifyStatus === "verifying" ? (
              <>
                <Container flex="row" center="x" animate="fadein">
                  <Spinner size="lg" color="accentText" />
                </Container>
              </>
            ) : (
              <Container animate="fadein" key="btn-container">
                <Button
                  onClick={() => handleSubmit(otpInput)}
                  variant="accent"
                  type="submit"
                  style={{
                    width: "100%",
                  }}
                >
                  Verify
                </Button>
              </Container>
            )}
          </Container>

          <Spacer y="xxl" />

          {!isWideModal && <Line />}

          <Container p={isWideModal ? undefined : "lg"}>
            {sendEmailOtpStatus === "error" && (
              <>
                <Text size="sm" center color="danger">
                  Failed to send OTP
                </Text>
                <Spacer y="md" />
              </>
            )}

            {sendEmailOtpStatus === "sending" && (
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

            {sendEmailOtpStatus === "sent" && (
              <LinkButton onClick={sendEmail} type="button">
                Resend OTP
              </LinkButton>
            )}
          </Container>
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
  font-weight: 500;
  width: 100%;
  &:hover {
    color: ${(p) => p.theme.colors.primaryText};
  }
`;
