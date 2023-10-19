import styled from "@emotion/styled";
import { ConnectUIProps, useWalletContext } from "@thirdweb-dev/react-core";
import { EmbeddedWallet, RecoveryShareManagement } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeIn } from "../../../components/FadeIn";
import { OTPInput } from "../../../components/OTPInput";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, Line, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { Theme, fontSize } from "../../../design-system";
import { BackupAccount } from "./USER_MANAGED/BackupAccount";
import { CreatePassword } from "./USER_MANAGED/CreatePassword";
import { EnterPasswordOrRecovery } from "./USER_MANAGED/EnterPassword";

type EmbeddedWalletOTPLoginUIProps = ConnectUIProps<EmbeddedWallet>;

type SentEmailInfo = {
  isNewDevice: boolean;
  isNewUser: boolean;
  recoveryShareManagement: RecoveryShareManagement;
};

type VerificationStatus = "verifying" | "invalid" | "valid" | "idle";
type EmailStatus = "sending" | SentEmailInfo | "error";
type ScreenToShow =
  | "base"
  | "create-password"
  | "backup-account"
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
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | undefined>();

  const sendEmail = useCallback(async () => {
    setOtpInput("");
    setVerifyStatus("idle");
    setEmailStatus("sending");

    try {
      const _wallet = createWalletInstance(props.walletConfig);
      setWallet(_wallet);
      const status = await _wallet.sendEmailOtp({ email });
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

    console.log({
      emailStatus,
    });

    const isUserManaged =
      emailStatus.recoveryShareManagement === "USER_MANAGED";

    try {
      setVerifyStatus("verifying");
      setConnectionStatus("connecting");

      // USER_MANAGED
      if (isUserManaged) {
        if (emailStatus.isNewUser) {
          try {
            await wallet.connect({
              loginType: "headless_email_otp_verification",
              email,
              otp,
            });
          } catch (e: any) {
            if (e instanceof Error && e.message.includes("encryption key")) {
              setScreen("create-password");
            } else {
              throw e;
            }
          }
        } else if (emailStatus.isNewDevice) {
          try {
            await wallet.connect({
              loginType: "headless_email_otp_verification",
              email,
              otp,
            });
          } catch (e: any) {
            if (e instanceof Error && e.message.includes("encryption key")) {
              setScreen("enter-password-or-recovery-code");
            } else {
              throw e;
            }
          }
        } else {
          await wallet.connect({
            loginType: "headless_email_otp_verification",
            email,
            otp,
          });
          setConnectedWallet(wallet);
          props.connected();
        }
      }

      // AWS_MANAGED
      else {
        await wallet.connect({
          loginType: "headless_email_otp_verification",
          email,
          otp,
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
          if (!wallet) {
            return;
          }

          await wallet.connect({
            loginType: "headless_email_otp_verification",
            email,
            otp: otpInput,
            encryptionKey: password,
          });

          const info = await wallet.getRecoveryInformation();
          setRecoveryCodes(info.backupRecoveryCodes);
          setScreen("backup-account");
        }}
      />
    );
  }

  if (screen === "backup-account") {
    return (
      <BackupAccount
        modalSize={props.modalSize}
        goBack={props.goBack}
        recoveryCodes={recoveryCodes}
        email={email}
        onNext={() => {
          if (wallet) {
            setConnectedWallet(wallet);
            props.connected();
          }
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
          if (wallet) {
            await wallet.connect({
              loginType: "headless_email_otp_verification",
              email,
              otp: otpInput,
              encryptionKey: passwordOrRecoveryCode,
            });

            setConnectedWallet(wallet);
            props.connected();
          }
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
