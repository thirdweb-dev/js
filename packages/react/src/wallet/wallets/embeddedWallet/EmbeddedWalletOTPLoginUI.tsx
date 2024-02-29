import { ConnectUIProps } from "@thirdweb-dev/react-core";
import {
  EmbeddedWallet,
  SendEmailOtpReturnType,
  type AuthResult,
} from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeIn } from "../../../components/FadeIn";
import { OTPInput } from "../../../components/OTPInput";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, Line, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { fontSize } from "../../../design-system";
import { CreatePassword } from "./USER_MANAGED/CreatePassword";
import { EnterPasswordOrRecovery } from "./USER_MANAGED/EnterPassword";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { StyledButton } from "../../../design-system/elements";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";

type EmbeddedWalletOTPLoginUIProps = ConnectUIProps<EmbeddedWallet>;

type VerificationStatus =
  | "verifying"
  | "invalid"
  | "valid"
  | "idle"
  | "payment_required";

type AccountStatus = "sending" | SendEmailOtpReturnType | "error";

type ScreenToShow =
  | "base"
  | "create-password"
  | "enter-password-or-recovery-code";

export const EmbeddedWalletOTPLoginUI: React.FC<
  EmbeddedWalletOTPLoginUIProps & {
    userInfo: { email: string } | { phone: string };
  }
> = (props) => {
  const { userInfo } = props;
  const isWideModal = props.modalSize === "wide";
  const locale = useTWLocale().wallets.embeddedWallet;

  const [otpInput, setOtpInput] = useState("");
  const { createWalletInstance, setConnectedWallet, setConnectionStatus } =
    props;

  const [wallet, setWallet] = useState<EmbeddedWallet | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<VerificationStatus>("idle");
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("sending");

  const [screen, setScreen] = useState<ScreenToShow>("base");

  const sendEmailOrSms = useCallback(async () => {
    setOtpInput("");
    setVerifyStatus("idle");
    setAccountStatus("sending");

    try {
      const _wallet = createWalletInstance();
      setWallet(_wallet);
      if ("email" in userInfo) {
        const status = await _wallet.sendVerificationEmail({
          email: userInfo.email,
        });
        setAccountStatus(status);
      } else {
        const status = await _wallet.sendVerificationSms({
          phoneNumber: userInfo.phone,
        });

        setAccountStatus(status);
      }
    } catch (e) {
      console.error(e);
      setVerifyStatus("idle");
      setAccountStatus("error");
    }
  }, [createWalletInstance, userInfo]);

  const verify = async (otp: string) => {
    if (typeof accountStatus !== "object" || otp.length !== 6) {
      return;
    }

    setVerifyStatus("idle");

    if (typeof accountStatus !== "object") {
      return;
    }

    if (!wallet) {
      return;
    }

    try {
      setVerifyStatus("verifying");
      setConnectionStatus("connecting");

      const needsRecoveryCode =
        accountStatus.recoveryShareManagement === "USER_MANAGED" &&
        (accountStatus.isNewUser || accountStatus.isNewDevice);

      // USER_MANAGED
      if (needsRecoveryCode) {
        if (accountStatus.isNewUser) {
          try {
            // verifies otp for UI feedback
            // TODO (ews) tweak the UI flow to avoid verifying otp twice - needs new endpoint or new UI
            if ("email" in userInfo) {
              await wallet.authenticate({
                strategy: "email_verification",
                email: userInfo.email,
                verificationCode: otp,
              });
            } else {
              await wallet.authenticate({
                strategy: "phone_number_verification",
                phoneNumber: userInfo.phone,
                verificationCode: otp,
              });
            }
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
            if ("email" in userInfo) {
              await wallet.authenticate({
                strategy: "email_verification",
                email: userInfo.email,
                verificationCode: otp,
              });
            } else {
              await wallet.authenticate({
                strategy: "phone_number_verification",
                phoneNumber: userInfo.phone,
                verificationCode: otp,
              });
            }
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
        let authResult: AuthResult;
        if ("email" in userInfo) {
          authResult = await wallet.authenticate({
            strategy: "email_verification",
            email: userInfo.email,
            verificationCode: otp,
          });
        } else {
          authResult = await wallet.authenticate({
            strategy: "phone_number_verification",
            phoneNumber: userInfo.phone,
            verificationCode: otp,
          });
        }

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
    } catch (e: any) {
      if (e?.message?.includes("PAYMENT_METHOD_REQUIRED")) {
        setVerifyStatus("payment_required");
      } else {
        setVerifyStatus("invalid");
      }
      console.error("Authentication Error", e);
    }
  };

  // send email on mount
  const emailSentOnMount = useRef(false);
  useEffect(() => {
    if (!emailSentOnMount.current) {
      emailSentOnMount.current = true;
      sendEmailOrSms();
    }
  }, [sendEmailOrSms]);

  if (screen === "create-password") {
    return (
      <CreatePassword
        modalSize={props.modalSize}
        goBack={props.goBack}
        onPassword={async (password) => {
          if (!wallet || typeof accountStatus !== "object") {
            return;
          }

          let authResult: AuthResult;
          if ("email" in userInfo) {
            authResult = await wallet.authenticate({
              strategy: "email_verification",
              email: userInfo.email,
              verificationCode: otpInput,
              recoveryCode: password,
            });
          } else {
            authResult = await wallet.authenticate({
              strategy: "phone_number_verification",
              phoneNumber: userInfo.phone,
              verificationCode: otpInput,
              recoveryCode: password,
            });
          }

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
        emailOrPhone={"email" in userInfo ? userInfo.email : userInfo.phone}
        onVerify={async (passwordOrRecoveryCode) => {
          if (!wallet || typeof accountStatus !== "object") {
            return;
          }

          let authResult: AuthResult;
          if ("email" in userInfo) {
            authResult = await wallet.authenticate({
              strategy: "email_verification",
              email: userInfo.email,
              verificationCode: otpInput,
              recoveryCode: passwordOrRecoveryCode,
            });
          } else {
            authResult = await wallet.authenticate({
              strategy: "phone_number_verification",
              phoneNumber: userInfo.phone,
              verificationCode: otpInput,
              recoveryCode: passwordOrRecoveryCode,
            });
          }

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
          <ModalHeader title={locale.signIn} onBack={props.goBack} />
        </Container>

        <Container expand flex="column" center="y">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Container flex="column" center="x" px="lg">
              {!isWideModal && <Spacer y="xl" />}
              <Text>{locale.otpLoginScreen.enterCodeSendTo}</Text>
              <Spacer y="sm" />
              <Text color="primaryText">
                {"email" in userInfo ? userInfo.email : userInfo.phone}
              </Text>
              <Spacer y="xl" />
            </Container>

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
                  {locale.otpLoginScreen.invalidCode}
                </Text>
              </FadeIn>
            )}

            {verifyStatus === "payment_required" && (
              <FadeIn>
                <Spacer y="md" />
                <Text size="sm" color="danger" center>
                  {locale.maxAccountsExceeded}
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
                    {locale.otpLoginScreen.verify}
                  </Button>
                </Container>
              )}
            </Container>

            <Spacer y="xl" />

            {!isWideModal && <Line />}

            <Container p={isWideModal ? undefined : "lg"}>
              {accountStatus === "error" && (
                <>
                  <Text size="sm" center color="danger">
                    {locale.otpLoginScreen.failedToSendCode}
                  </Text>
                </>
              )}

              {accountStatus === "sending" && (
                <Container
                  flex="row"
                  center="both"
                  gap="xs"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Text size="sm">{locale.otpLoginScreen.sendingCode}</Text>
                  <Spinner size="xs" color="secondaryText" />
                </Container>
              )}

              {typeof accountStatus === "object" && (
                <LinkButton onClick={sendEmailOrSms} type="button">
                  {locale.otpLoginScreen.resendCode}
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

const LinkButton = /* @__PURE__ */ StyledButton(() => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    color: theme.colors.accentText,
    fontSize: fontSize.sm,
    cursor: "pointer",
    textAlign: "center",
    fontWeight: 500,
    width: "100%",
    "&:hover": {
      color: theme.colors.primaryText,
    },
  };
});
