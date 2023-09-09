import { PaperWallet } from "@thirdweb-dev/wallets";
import { ConnectUIProps, useWalletContext } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeIn } from "../../../components/FadeIn";
import { OTPInput } from "../../../components/OTPInput";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import {
  Flex,
  Line,
  ModalHeader,
  ScreenContainer,
} from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Input } from "../../../components/formElements";
import { Text } from "../../../components/text";
import { Theme, fontSize } from "../../../design-system";
import styled from "@emotion/styled";
import { RecoveryShareManagement } from "./types";

type PaperOTPLoginUIProps = ConnectUIProps<PaperWallet> & {
  recoveryShareManagement: RecoveryShareManagement;
};
type SentEmailInfo = {
  isNewDevice: boolean;
  isNewUser: boolean;
};
export const PaperOTPLoginUI: React.FC<PaperOTPLoginUIProps> = (props) => {
  const email = props.selectionData;
  const [otpInput, setOtpInput] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const { createWalletInstance, setConnectedWallet } = useWalletContext();

  const [wallet, setWallet] = useState<PaperWallet | null>(null);

  const [verifyStatus, setVerifyStatus] = useState<
    "verifying" | "invalid" | "valid" | "idle"
  >("idle");

  const [sentEmailInfo, setSentEmailInfo] = useState<
    SentEmailInfo | null | "error"
  >(null);

  const recoveryCodeRequired = !!(
    props.recoveryShareManagement !== "AWS_MANAGED" &&
    sentEmailInfo &&
    sentEmailInfo !== "error" &&
    sentEmailInfo.isNewDevice &&
    !sentEmailInfo.isNewUser
  );

  const sendEmail = useCallback(async () => {
    setOtpInput("");
    setVerifyStatus("idle");
    setSentEmailInfo(null);

    const _wallet = createWalletInstance(props.walletConfig);
    setWallet(_wallet);
    const _paperSDK = await _wallet.getPaperSDK();

    try {
      const { isNewDevice, isNewUser } =
        await _paperSDK.auth.sendPaperEmailLoginOtp({
          email: email,
        });

      setSentEmailInfo({ isNewDevice, isNewUser });
    } catch (e) {
      console.error(e);
      setVerifyStatus("idle");
      setSentEmailInfo("error");
    }
  }, [createWalletInstance, email, props.walletConfig]);

  const handleSubmit = () => {
    if (recoveryCodeRequired && !recoveryCode) {
      return;
    }

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
    <ScreenContainer
      style={{
        height: "100%",
      }}
    >
      <ModalHeader title="Sign in" onBack={props.goBack} />

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
          <Text color="neutral">{email}</Text>
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

        {recoveryCodeRequired && (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Spacer y="xl" />
            <Line color="elevated" height={2} />
            <Spacer y="xl" />

            <Text color="neutral">New device detected</Text>
            <Spacer y="sm" />
            <Text
              multiline
              style={{
                maxWidth: "350px",
              }}
            >
              Enter the recovery code emailed to you <br /> when you first
              signed up
            </Text>

            <Spacer y="md" />
            <Input
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
          </div>
        )}

        {verifyStatus === "invalid" && (
          <FadeIn>
            <Spacer y="sm" />
            <Flex justifyContent="center">
              <Text size="sm" color="danger">
                Invalid OTP {recoveryCodeRequired ? "or recovery code" : ""}
              </Text>
            </Flex>
          </FadeIn>
        )}

        <Spacer y="xl" />

        {verifyStatus === "verifying" ? (
          <>
            <Spacer y="md" />
            <Flex justifyContent="center">
              <Spinner size="md" color="accent" />
            </Flex>
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
          <Flex
            gap="xs"
            alignItems="center"
            justifyContent="center"
            style={{
              textAlign: "center",
            }}
          >
            <Text size="sm">Sending OTP</Text>
            <Spinner size="xs" color="secondary" />
          </Flex>
        )}

        {sentEmailInfo && (
          <LinkButton onClick={sendEmail} type="button">
            Resend OTP
          </LinkButton>
        )}
      </form>
    </ScreenContainer>
  );
};

const LinkButton = styled.button<{ theme?: Theme }>`
  all: unset;
  color: ${(p) => p.theme.text.accent};
  font-size: ${fontSize.sm};
  cursor: pointer;
  text-align: center;
  width: 100%;
  &:hover {
    color: ${(p) => p.theme.text.neutral};
  }
`;
