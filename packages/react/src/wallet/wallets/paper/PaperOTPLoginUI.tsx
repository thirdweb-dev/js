import { PaperWallet } from "@thirdweb-dev/wallets";
import { ConnectUIProps, useWalletContext } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeIn } from "../../../components/FadeIn";
import { OTPInput } from "../../../components/OTPInput";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Flex, ScreenContainer } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Input } from "../../../components/formElements";
import { BackButton, ModalTitle } from "../../../components/modalElements";
import {
  SecondaryText,
  NeutralText,
  DangerText,
} from "../../../components/text";
import { Theme, fontSize } from "../../../design-system";
import styled from "@emotion/styled";
import { RecoveryShareManagement } from "./PaperConfig";

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <BackButton onClick={props.goBack} />

        <ModalTitle
          style={{
            textAlign: "center",
          }}
        >
          Sign in
        </ModalTitle>

        <div
          style={{
            textAlign: "center",
          }}
        >
          <Spacer y="xl" />
          <SecondaryText>Enter the OTP sent to</SecondaryText>
          <Spacer y="sm" />
          <NeutralText>{email}</NeutralText>
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
            <Line />
            <Spacer y="xl" />

            <NeutralText>New device detected</NeutralText>
            <Spacer y="sm" />
            <SecondaryText
              style={{
                lineHeight: "1.5",
                maxWidth: "350px",
              }}
            >
              Enter the recovery code emailed to you <br /> when you first
              signed up
            </SecondaryText>

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
              <DangerText
                style={{
                  fontSize: fontSize.sm,
                }}
              >
                Invalid OTP {recoveryCodeRequired ? "or recovery code" : ""}
              </DangerText>
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
            variant="inverted"
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
            <DangerText
              style={{
                fontSize: fontSize.sm,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Failed to send OTP
            </DangerText>
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
            <SecondaryText
              style={{
                fontSize: fontSize.sm,
              }}
            >
              Sending OTP
            </SecondaryText>
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

const Line = styled.div<{ theme?: Theme }>`
  height: 2px;
  background: ${(p) => p.theme.bg.baseHover};
`;
