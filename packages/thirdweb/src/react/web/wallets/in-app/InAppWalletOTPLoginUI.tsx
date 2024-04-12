import { useCallback, useEffect, useRef, useState } from "react";
import { preAuthenticate } from "../../../../wallets/in-app/core/authentication/index.js";
import type { SendEmailOtpReturnType } from "../../../../wallets/in-app/implementations/index.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { FadeIn } from "../../ui/components/FadeIn.js";
import { OTPInput } from "../../ui/components/OTPInput.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, Line, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Text } from "../../ui/components/text.js";
import { useCustomTheme } from "../../ui/design-system/CustomThemeProvider.js";
import { StyledButton } from "../../ui/design-system/elements.js";
import { fontSize } from "../../ui/design-system/index.js";
import type { InAppWalletLocale } from "./locale/types.js";

type VerificationStatus =
  | "verifying"
  | "invalid"
  | "valid"
  | "idle"
  | "payment_required";
type EmailStatus = "sending" | SendEmailOtpReturnType | "error";
type ScreenToShow =
  | "base"
  | "create-password"
  | "enter-password-or-recovery-code";

/**
 * @internal
 */
export function InAppWalletOTPLoginUI(props: {
  wallet: Wallet<"inApp">;
  email: string;
  locale: InAppWalletLocale;
  done: () => void;
  goBack?: () => void;
}) {
  const { wallet, done, goBack } = props;
  const email = props.email;
  const { client, chain, connectModal } = useConnectUI();
  const isWideModal = connectModal.size === "wide";
  const locale = props.locale;
  const [otpInput, setOtpInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<VerificationStatus>("idle");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("sending");

  const [screen] = useState<ScreenToShow>("base");

  const sendEmail = useCallback(async () => {
    setOtpInput("");
    setVerifyStatus("idle");
    setEmailStatus("sending");

    try {
      const status = await preAuthenticate({
        email,
        strategy: "email",
        client,
      });
      setEmailStatus(status);
    } catch (e) {
      console.error(e);
      setVerifyStatus("idle");
      setEmailStatus("error");
    }
  }, [client, email]);

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

      const needsRecoveryCode =
        emailStatus.recoveryShareManagement === "USER_MANAGED" &&
        (emailStatus.isNewUser || emailStatus.isNewDevice);

      // USER_MANAGED
      if (needsRecoveryCode) {
        if (emailStatus.isNewUser) {
          try {
            await wallet.connect({
              chain,
              strategy: "email",
              email,
              verificationCode: otp,
              client,
            });
          } catch (e) {
            if (e instanceof Error && e.message.includes("encryption key")) {
              // TODO: do we need this?
              // setScreen("create-password");
            } else {
              throw e;
            }
          }
        } else {
          try {
            // verifies otp for UI feedback
            await wallet.connect({
              chain,
              strategy: "email",
              email,
              verificationCode: otp,
              client,
            });
          } catch (e) {
            if (e instanceof Error && e.message.includes("encryption key")) {
              // TODO: do we need this?
              // setScreen("enter-password-or-recovery-code");
            } else {
              throw e;
            }
          }
        }
      }

      // AWS_MANAGED
      else {
        const authResult = await wallet.connect({
          chain,
          strategy: "email",
          email,
          verificationCode: otp,
          client,
        });
        if (!authResult) {
          throw new Error("Failed to verify OTP");
        }

        done();
      }

      setVerifyStatus("valid");
    } catch (e) {
      if (
        e instanceof Error &&
        e?.message?.includes("PAYMENT_METHOD_REQUIRED")
      ) {
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
      sendEmail();
    }
  }, [sendEmail]);

  if (screen === "base") {
    return (
      <Container fullHeight flex="column" animate="fadein">
        <Container p="lg">
          <ModalHeader title={locale.signIn} onBack={goBack} />
        </Container>

        <Container expand flex="column" center="y">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Container flex="column" center="x" px="lg">
              {!isWideModal && <Spacer y="xl" />}
              <Text>{locale.emailLoginScreen.enterCodeSendTo}</Text>
              <Spacer y="sm" />
              <Text color="primaryText">{email}</Text>
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
                  {locale.emailLoginScreen.invalidCode}
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
                    {locale.emailLoginScreen.verify}
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
                    {locale.emailLoginScreen.failedToSendCode}
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
                  <Text size="sm">{locale.emailLoginScreen.sendingCode}</Text>
                  <Spinner size="xs" color="secondaryText" />
                </Container>
              )}

              {typeof emailStatus === "object" && (
                <LinkButton onClick={sendEmail} type="button">
                  {locale.emailLoginScreen.resendCode}
                </LinkButton>
              )}
            </Container>
          </form>
        </Container>
      </Container>
    );
  }

  return null;
}

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
