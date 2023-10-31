import styled from "@emotion/styled";
import { ConnectUIProps, useWalletContext } from "@thirdweb-dev/react-core";
import { EmbeddedWallet, SendEmailOtpReturnType } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeIn } from "../../../components/FadeIn";
import { OTPInput } from "../../../components/OTPInput";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, Line, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { Theme, fontSize } from "../../../design-system";
import { CreatePassword } from "./USER_MANAGED/CreatePassword";
import { EnterPasswordOrRecovery } from "./USER_MANAGED/EnterPassword";

type EmbeddedWalletOTPLoginUIProps = ConnectUIProps<EmbeddedWallet>;

type VerificationStatus = "verifying" | "invalid" | "valid" | "idle";
type EmailStatus = "sending" | SendEmailOtpReturnType | "error";
type ScreenToShow =
  | "base"
  | "create-password"
  | "enter-password-or-recovery-code";

export const EmbeddedWalletOTPLoginUI: React.FC<
  EmbeddedWalletOTPLoginUIProps
> = (props) => {
  const email = props.selectionData;
  const isWideModal = props.modalSize === "wide";

  const [otpInput, setOtpInput] = useState("");
  const { createWalletInstance, setConnectedWallet, setConnectionStatus } =
    useWalletContext();

  const [wallet, setWallet] = useState<EmbeddedWallet | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<VerificationStatus>("idle");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("sending");

  const [screen, setScreen] = useState<ScreenToShow>("base"); // TODO change

  const sendEmail = useCallback(async () => {
    setOtpInput("");
    setVerifyStatus("idle");
    setEmailStatus("sending");

    try {
      const _wallet = createWalletInstance(props.walletConfig);
      setWallet(_wallet);
      const status = await _wallet.sendVerificationEmail({ email });
      setEmailStatus(status);
    } catch (e) {
      console.error(e);
      setVerifyStatus("idle");
      setEmailStatus("error");
    }
  }, [createWalletInstance, email, props.walletConfig]);

  const verify = async (otp: string) => {
    if (typeof emailStatus !== "object" || otp.length !== 6) {
      return;
    }

    setVerifyStatus("idle");

    if (typeof emailStatus !== "object") {
      return;
    }

    if (!wallet) {
      return;
    }

    try {
      setVerifyStatus("verifying");
      setConnectionStatus("connecting");

      const needsRecoveryCode =
        emailStatus.recoveryShareManagement === "USER_MANAGED" &&
        (emailStatus.isNewUser || emailStatus.isNewDevice);

      // USER_MANAGED
      if (needsRecoveryCode) {
        if (emailStatus.isNewUser) {
          try {
            // verifies otp for UI feedback
            // TODO (ews) tweak the UI flow to avoid verifying otp twice - needs new endpoint or new UI
            await wallet.authenticate({
              strategy: "email_verification",
              email,
              verificationCode: otp,
            });
          } catch (e: any) {
            if (e instanceof Error && e.message.includes("encryption key")) {
              setScreen("create-password");
            } else {
              throw e;
            }
          }
        } else {
          try {
            // verifies otp for UI feedback
            await wallet.authenticate({
              strategy: "email_verification",
              email,
              verificationCode: otp,
            });
          } catch (e: any) {
            if (e instanceof Error && e.message.includes("encryption key")) {
              setScreen("enter-password-or-recovery-code");
            } else {
              throw e;
            }
          }
        }
      }

      // AWS_MANAGED
      else {
        const authResult = await wallet.authenticate({
          strategy: "email_verification",
          email,
          verificationCode: otp,
        });
        if (!authResult) {
          throw new Error("Failed to verify OTP");
        }
        await wallet.connect({
          authResult,
        });
        setConnectedWallet(wallet);
        props.connected();
      }

      setVerifyStatus("valid");
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

  if (screen === "create-password") {
    return (
      <CreatePassword
        modalSize={props.modalSize}
        email={email}
        goBack={props.goBack}
        onPassword={async (password) => {
          if (!wallet || typeof emailStatus !== "object") {
            return;
          }
          const authResult = await wallet.authenticate({
            strategy: "email_verification",
            email,
            verificationCode: otpInput,
            recoveryCode: password,
          });
          if (!authResult) {
            throw new Error("Failed to verify recovery code");
          }
          await wallet.connect({
            authResult,
          });
          setConnectedWallet(wallet);
          props.connected();
        }}
      />
    );
  }

  if (screen === "enter-password-or-recovery-code") {
    return (
      <EnterPasswordOrRecovery
        modalSize={props.modalSize}
        goBack={props.goBack}
        email={email}
        onVerify={async (passwordOrRecoveryCode) => {
          if (!wallet || typeof emailStatus !== "object") {
            return;
          }
          const authResult = await wallet.authenticate({
            strategy: "email_verification",
            email,
            verificationCode: otpInput,
            recoveryCode: passwordOrRecoveryCode,
          });
          if (!authResult) {
            throw new Error("Failed to verify recovery code");
          }
          await wallet.connect({
            authResult,
          });

          setConnectedWallet(wallet);
          props.connected();
        }}
      />
    );
  }

  if (screen === "base") {
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
              <Text>Enter the verification code sent to</Text>
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
                verify(value);
              }}
              onEnter={() => {
                verify(otpInput);
              }}
            />

            {verifyStatus === "invalid" && (
              <FadeIn>
                <Spacer y="md" />
                <Text size="sm" color="danger" center>
                  Invalid verification code
                </Text>
              </FadeIn>
            )}

            <Spacer y="xl" />

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
                    onClick={() => verify(otpInput)}
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

            <Spacer y="xl" />

            {!isWideModal && <Line />}

            <Container p={isWideModal ? undefined : "lg"}>
              {emailStatus === "error" && (
                <>
                  <Text size="sm" center color="danger">
                    Failed to send verification code
                  </Text>
                </>
              )}

              {emailStatus === "sending" && (
                <Container
                  flex="row"
                  center="both"
                  gap="xs"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Text size="sm">Sending verification code</Text>
                  <Spinner size="xs" color="secondaryText" />
                </Container>
              )}

              {typeof emailStatus === "object" && (
                <LinkButton onClick={sendEmail} type="button">
                  Resend verification code
                </LinkButton>
              )}
            </Container>
          </form>
        </Container>
      </Container>
    );
  }

  return null;
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
