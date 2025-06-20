"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import {
  linkProfile,
  preAuthenticate,
} from "../../../../wallets/in-app/web/lib/auth/index.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { fontSize } from "../../../core/design-system/index.js";
import { setLastAuthProvider } from "../../../core/utils/storage.js";
import { Container, Line, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { FadeIn } from "../../ui/components/FadeIn.js";
import { OTPInput } from "../../ui/components/OTPInput.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Text } from "../../ui/components/text.js";
import { StyledButton } from "../../ui/design-system/elements.js";
import type { InAppWalletLocale } from "./locale/types.js";

type VerificationStatus =
  | "verifying"
  | "invalid"
  | "linking_error"
  | "valid"
  | "idle"
  | "payment_required";
type AccountStatus = "sending" | "sent" | "error";
type ScreenToShow = "base" | "enter-password-or-recovery-code";

/**
 * @internal
 */
export function OTPLoginUI(props: {
  userInfo: { email: string } | { phone: string };
  wallet: Wallet;
  locale: InAppWalletLocale;
  done: () => void;
  goBack?: () => void;
  client: ThirdwebClient;
  chain: Chain | undefined;
  size: "compact" | "wide";
  isLinking?: boolean;
}) {
  const { wallet, done, goBack, userInfo } = props;
  const isWideModal = props.size === "wide";
  const locale = props.locale;
  const [otpInput, setOtpInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<VerificationStatus>("idle");
  const [error, setError] = useState<string | undefined>();
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("sending");
  const [countdown, setCountdown] = useState(0);
  const ecosystem = isEcosystemWallet(wallet)
    ? {
        id: wallet.id,
        partnerId: wallet.getConfig()?.partnerId,
      }
    : undefined;

  const [screen] = useState<ScreenToShow>("base");

  const sendEmailOrSms = useCallback(async () => {
    setOtpInput("");
    setVerifyStatus("idle");
    setAccountStatus("sending");

    try {
      if ("email" in userInfo) {
        await preAuthenticate({
          client: props.client,
          ecosystem,
          email: userInfo.email,
          strategy: "email",
        });
        setAccountStatus("sent");
        setCountdown(60); // Start 60-second countdown
      } else if ("phone" in userInfo) {
        await preAuthenticate({
          client: props.client,
          ecosystem,
          phoneNumber: userInfo.phone,
          strategy: "phone",
        });
        setAccountStatus("sent");
        setCountdown(60); // Start 60-second countdown
      } else {
        throw new Error("Invalid userInfo");
      }
    } catch (e) {
      console.error(e);
      setVerifyStatus("idle");
      setAccountStatus("error");
    }
  }, [props.client, userInfo, ecosystem]);

  async function connect(otp: string) {
    if ("email" in userInfo) {
      await wallet.connect({
        chain: props.chain,
        client: props.client,
        email: userInfo.email,
        strategy: "email",
        verificationCode: otp,
      });
      await setLastAuthProvider("email", webLocalStorage);
    } else if ("phone" in userInfo) {
      await wallet.connect({
        chain: props.chain,
        client: props.client,
        phoneNumber: userInfo.phone,
        strategy: "phone",
        verificationCode: otp,
      });
      await setLastAuthProvider("phone", webLocalStorage);
    } else {
      throw new Error("Invalid userInfo");
    }
  }

  async function link(otp: string) {
    if ("email" in userInfo) {
      await linkProfile({
        client: props.client,
        ecosystem,
        email: userInfo.email,
        strategy: "email",
        verificationCode: otp,
      });
    } else if ("phone" in userInfo) {
      await linkProfile({
        client: props.client,
        ecosystem,
        phoneNumber: userInfo.phone,
        strategy: "phone",
        verificationCode: otp,
      });
    }
  }

  const verify = async (otp: string) => {
    if (otp.length !== 6) {
      return;
    }
    setVerifyStatus("verifying");

    try {
      // verifies otp for UI feedback
      if (props.isLinking) {
        await link(otp);
      } else {
        await connect(otp);
      }
      done();

      setVerifyStatus("valid");
    } catch (e) {
      // TODO: More robust error handling
      if (
        e instanceof Error &&
        e?.message?.includes("PAYMENT_METHOD_REQUIRED")
      ) {
        setVerifyStatus("payment_required");
      } else if (
        e instanceof Error &&
        (e.message.toLowerCase().includes("link") ||
          e.message.toLowerCase().includes("profile"))
      ) {
        setVerifyStatus("linking_error");
        setError(e.message);
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

  // Handle countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  if (screen === "base") {
    return (
      <Container animate="fadein" flex="column" fullHeight>
        <Container p="lg">
          <ModalHeader onBack={goBack} title={locale.signIn} />
        </Container>

        <Container center="y" expand flex="column">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Container center="x" flex="column" px="lg">
              {!isWideModal && <Spacer y="xl" />}
              <Text>{locale.emailLoginScreen.enterCodeSendTo}</Text>
              <Spacer y="sm" />
              <Text color="primaryText">
                {"email" in userInfo ? userInfo.email : userInfo.phone}
              </Text>
              <Spacer y="xl" />
            </Container>

            <OTPInput
              digits={6}
              isInvalid={verifyStatus === "invalid"}
              onEnter={() => {
                verify(otpInput);
              }}
              setValue={(value) => {
                setOtpInput(value);
                setVerifyStatus("idle"); // reset error
              }}
              value={otpInput}
            />

            {verifyStatus === "invalid" && (
              <FadeIn>
                <Spacer y="md" />
                <Text center color="danger" size="sm">
                  {locale.emailLoginScreen.invalidCode}
                </Text>
              </FadeIn>
            )}

            {verifyStatus === "linking_error" && (
              <FadeIn>
                <Spacer y="md" />
                <Text center color="danger" size="sm">
                  {error || "Failed to verify code"}
                </Text>
              </FadeIn>
            )}

            {verifyStatus === "payment_required" && (
              <FadeIn>
                <Spacer y="md" />
                <Text center color="danger" size="sm">
                  {locale.maxAccountsExceeded}
                </Text>
              </FadeIn>
            )}

            <Spacer y="xl" />

            <Container px={isWideModal ? "xxl" : "lg"}>
              {verifyStatus === "verifying" ? (
                <Container animate="fadein" center="x" flex="row">
                  <Spinner color="accentText" size="lg" />
                </Container>
              ) : (
                <Container animate="fadein" key="btn-container">
                  <Button
                    onClick={() => verify(otpInput)}
                    style={{
                      width: "100%",
                    }}
                    type="submit"
                    variant="accent"
                  >
                    {locale.emailLoginScreen.verify}
                  </Button>
                </Container>
              )}
            </Container>

            <Spacer y="xl" />

            {!isWideModal && <Line />}

            <Container gap="xs" p={isWideModal ? undefined : "lg"}>
              {accountStatus === "error" && (
                <Text center color="danger" size="sm">
                  {locale.emailLoginScreen.failedToSendCode}
                </Text>
              )}

              {accountStatus === "sending" && (
                <Container
                  center="both"
                  flex="row"
                  gap="xs"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Text size="sm">{locale.emailLoginScreen.sendingCode}</Text>
                  <Spinner color="secondaryText" size="xs" />
                </Container>
              )}

              {accountStatus !== "sending" && (
                <LinkButton
                  onClick={countdown === 0 ? sendEmailOrSms : undefined}
                  style={{
                    cursor: countdown > 0 ? "default" : "pointer",
                    opacity: countdown > 0 ? 0.5 : 1,
                  }}
                  type="button"
                >
                  {countdown > 0
                    ? `Resend code in ${countdown} seconds`
                    : locale.emailLoginScreen.resendCode}
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

const LinkButton = /* @__PURE__ */ StyledButton((_) => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      color: theme.colors.primaryText,
    },
    all: "unset",
    color: theme.colors.accentText,
    cursor: "pointer",
    fontSize: fontSize.sm,
    fontWeight: 500,
    textAlign: "center",
    width: "100%",
  };
});
