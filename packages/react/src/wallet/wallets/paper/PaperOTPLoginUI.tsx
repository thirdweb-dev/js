import styled from "@emotion/styled";
import { ConnectUIProps, useWalletContext } from "@thirdweb-dev/react-core";
import { PaperWallet } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeIn } from "../../../components/FadeIn";
import { OTPInput } from "../../../components/OTPInput";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, Line, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Input } from "../../../components/formElements";
import { Text } from "../../../components/text";
import { Theme, fontSize } from "../../../design-system";
import { RecoveryShareManagement } from "./types";

type PaperOTPLoginUIProps = ConnectUIProps<PaperWallet> & {
  recoveryShareManagement: RecoveryShareManagement;
};

type SentEmailInfo = {
  isNewDevice: boolean;
  isNewUser: boolean;
  recoveryShareManagement: RecoveryShareManagement;
};

export const PaperOTPLoginUI: React.FC<PaperOTPLoginUIProps> = (props) => {
  const email = props.selectionData;
  const [otpInput, setOtpInput] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const { createWalletInstance, setConnectedWallet, setConnectionStatus } =
    useWalletContext();

  const [wallet, setWallet] = useState<PaperWallet | null>(null);
  const isWideModal = props.modalSize === "wide";

  const [verifyStatus, setVerifyStatus] = useState<
    "verifying" | "invalid" | "valid" | "idle"
  >("idle");

  const [sendEmailStatus, setSendEmailStatus] = useState<
    SentEmailInfo | "sending" | "error"
  >("sending");

  const recoveryCodeRequired = !!(
    typeof sendEmailStatus !== "string" &&
    sendEmailStatus.recoveryShareManagement !== "AWS_MANAGED" &&
    sendEmailStatus.isNewDevice &&
    !sendEmailStatus.isNewUser
  );

  const sendEmail = useCallback(async () => {
    setOtpInput("");
    setVerifyStatus("idle");
    setSendEmailStatus("sending");

    try {
      const _wallet = createWalletInstance(props.walletConfig);
      setWallet(_wallet);
      const _paperSDK = await _wallet.getPaperSDK();

      const { isNewDevice, isNewUser, recoveryShareManagement } =
        await _paperSDK.auth.sendPaperEmailLoginOtp({
          email: email,
        });

      setSendEmailStatus({ isNewDevice, isNewUser, recoveryShareManagement });
    } catch (e) {
      console.error(e);
      setVerifyStatus("idle");
      setSendEmailStatus("error");
    }
  }, [createWalletInstance, email, props.walletConfig]);

  const handleSubmit = (otp: string) => {
    if (recoveryCodeRequired && !recoveryCode) {
      return;
    }

    if (typeof sendEmailStatus === "string" || otp.length !== 6) {
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
        email,
        otp,
        recoveryCode: recoveryCodeRequired ? recoveryCode : undefined,
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
            {!isWideModal && <Spacer y="lg" />}
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
              setVerifyStatus("idle"); // reset error
              if (!recoveryCodeRequired) {
                handleSubmit(value);
              }
            }}
            onEnter={() => {
              handleSubmit(otpInput);
            }}
          />

          {recoveryCodeRequired && (
            <Container
              px="lg"
              style={{
                textAlign: "center",
              }}
            >
              <Spacer y="xxl" />
              <Text color="primaryText">New device detected</Text>
              <Spacer y="sm" />
              <Text
                size="sm"
                multiline
                style={{
                  maxWidth: "350px",
                }}
              >
                Enter the recovery code emailed to you <br /> when you first
                signed up
              </Text>

              <Spacer y="lg" />
              <Input
                sm
                autoComplete="off"
                required
                data-error={verifyStatus === "invalid"}
                id="recovery-code"
                variant="outline"
                style={{
                  textAlign: "center",
                }}
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                placeholder="Enter your recovery code"
              />
            </Container>
          )}

          {verifyStatus === "invalid" && (
            <FadeIn>
              <Spacer y="md" />
              <Text size="sm" color="danger" center>
                Invalid OTP {recoveryCodeRequired ? "or recovery code" : ""}
              </Text>
            </FadeIn>
          )}

          <Spacer y={recoveryCodeRequired ? "xl" : "xxl"} />

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

          <Spacer y={recoveryCodeRequired ? "xl" : "xxl"} />

          {!isWideModal && <Line />}

          <Container p={isWideModal ? undefined : "lg"}>
            {sendEmailStatus === "error" && (
              <>
                <Text size="sm" center color="danger">
                  Failed to send OTP
                </Text>
                <Spacer y="md" />
              </>
            )}

            {sendEmailStatus === "sending" && (
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

            {typeof sendEmailStatus !== "string" && (
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
  width: 100%;
  &:hover {
    color: ${(p) => p.theme.colors.primaryText};
  }
`;
