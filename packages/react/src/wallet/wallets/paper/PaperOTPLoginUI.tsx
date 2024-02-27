import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { PaperWallet } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { OTPInput } from "../../../components/OTPInput";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Container, Line, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Input } from "../../../components/formElements";
import { Text } from "../../../components/text";
import { fontSize } from "../../../design-system";
import { RecoveryShareManagement } from "./types";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { StyledButton } from "../../../design-system/elements";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";

type PaperOTPLoginUIProps = ConnectUIProps<PaperWallet> & {
  recoveryShareManagement: RecoveryShareManagement;
};

type SentEmailInfo = {
  isNewDevice: boolean;
  isNewUser: boolean;
  recoveryShareManagement: RecoveryShareManagement;
};

export const PaperOTPLoginUI: React.FC<PaperOTPLoginUIProps> = (props) => {
  const locale = useTWLocale().wallets.paperWallet.emailLoginScreen;
  const email = props.selectionData;
  const [otpInput, setOtpInput] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const { createWalletInstance, setConnectedWallet, setConnectionStatus } =
    props;

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
      const _wallet = createWalletInstance();
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
  }, [createWalletInstance, email]);

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
      props.connected();
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
        <ModalHeader title={locale.title} onBack={props.goBack} />
      </Container>

      <Container expand flex="column" center="y">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Container flex="column" center="x" px="lg">
            {!isWideModal && <Spacer y="lg" />}
            <Text>{locale.enterCodeSendTo}</Text>
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
              animate="fadein"
              px="lg"
              style={{
                textAlign: "center",
              }}
            >
              <Spacer y="xxl" />
              <Text color="primaryText">{locale.newDeviceDetected}</Text>
              <Spacer y="sm" />
              <Text
                balance
                size="sm"
                multiline
                style={{
                  maxWidth: "350px",
                }}
              >
                {locale.enterRecoveryCode}
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
                placeholder={locale.enterRecoveryCode}
              />
            </Container>
          )}

          {verifyStatus === "invalid" && (
            <Container animate="fadein">
              <Spacer y="md" />
              <Text size="sm" color="danger" center>
                {recoveryCodeRequired
                  ? locale.invalidCodeOrRecoveryCode
                  : locale.invalidCode}
              </Text>
            </Container>
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
                  onClick={() => handleSubmit(otpInput)}
                  variant="accent"
                  type="submit"
                  style={{
                    width: "100%",
                  }}
                >
                  {locale.verify}
                </Button>
              </Container>
            )}
          </Container>

          <Spacer y={"xl"} />

          {!isWideModal && <Line />}

          <Container p={isWideModal ? undefined : "lg"} animate="fadein">
            {sendEmailStatus === "error" && (
              <>
                <Text size="sm" center color="danger">
                  {locale.failedToSendCode}
                </Text>
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
                <Text size="sm">{locale.sendingCode}</Text>
                <Spinner size="xs" color="secondaryText" />
              </Container>
            )}

            {typeof sendEmailStatus !== "string" && (
              <LinkButton onClick={sendEmail} type="button">
                {locale.resendCode}
              </LinkButton>
            )}
          </Container>
        </form>
      </Container>
    </Container>
  );
};

const LinkButton = /* @__PURE__ */ StyledButton(() => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    color: theme.colors.accentText,
    fontSize: fontSize.sm,
    cursor: "pointer",
    textAlign: "center",
    width: "100%",
    "&:hover": {
      color: theme.colors.primaryText,
    },
  };
});
