import {
  PaperWallet,
  PaperWalletAdditionalOptions,
} from "@thirdweb-dev/wallets";
import {
  WalletConfig,
  WalletOptions,
  SelectUIProps,
  ConnectUIProps,
  useConnect,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { Flex } from "../../components/basic";
import { InputSelectionUI } from "./InputSelectionUI";
import { OTPInput } from "../../components/OTPInput";
import { BackButton, ModalTitle } from "../../components/modalElements";
import { Spacer } from "../../components/Spacer";
import { DangerText, NeutralText, SecondaryText } from "../../components/text";
import { Button } from "../../components/buttons";
import styled from "@emotion/styled";
import { Theme, fontSize } from "../../design-system";
import { FadeIn } from "../../components/FadeIn";
import { Input } from "../../components/formElements";

type PaperConfig = Omit<PaperWalletAdditionalOptions, "chain" | "chains">;
type RecoveryShareManagement = Exclude<
  PaperWalletAdditionalOptions["advancedOptions"],
  undefined
>["recoveryShareManagement"];

export const paperWallet = (config: PaperConfig): WalletConfig<PaperWallet> => {
  return {
    id: PaperWallet.id,
    meta: PaperWallet.meta,
    create(options: WalletOptions) {
      return new PaperWallet({ ...options, ...config });
    },
    selectUI: PaperSelectionUI,
    connectUI: (props) => (
      <PaperConnectionUI
        {...props}
        recoveryShareManagement={
          config.advancedOptions?.recoveryShareManagement
        }
      />
    ),
  };
};

const PaperSelectionUI: React.FC<SelectUIProps<PaperWallet>> = (props) => {
  return (
    <div>
      <InputSelectionUI
        onSelect={props.onSelect}
        placeholder="Enter your email address"
        name="email"
        type="email"
        errorMessage={(_input) => {
          const input = _input.replace(/\+/g, "");
          const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
          const isValidEmail = emailRegex.test(input);
          if (!isValidEmail) {
            return "Invalid email address";
          }
        }}
        emptyErrorMessage="email address is required"
        supportedWallets={props.supportedWallets}
      />
    </div>
  );
};

type ConnectUIPropsWithOptions = ConnectUIProps<PaperWallet> & {
  recoveryShareManagement: RecoveryShareManagement;
};

const PaperConnectionUI: React.FC<ConnectUIPropsWithOptions> = (props) => {
  // login with google
  if (!props.selectionData) {
    return <LoginWithGoogle {...props} />;
  }

  // login with email OTP
  return <LoginWithEmailOTP {...props} />;
};

const LoginWithGoogle: React.FC<ConnectUIPropsWithOptions> = ({
  close,
  walletConfig,
  open,
  selectionData,
  supportedWallets,
}) => {
  const connectPrompted = useRef(false);
  const connect = useConnect();
  const singleWallet = supportedWallets.length === 1;

  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }
    connectPrompted.current = true;

    (async () => {
      close();
      try {
        await connect(walletConfig, { email: selectionData });
      } catch (e) {
        if (!singleWallet) {
          open();
        }
        console.error(e);
      }
    })();
  }, [connect, walletConfig, close, open, singleWallet, selectionData]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "250px",
      }}
    >
      <Spinner size="md" color="primary" />
    </Flex>
  );
};

type SentEmailInfo = {
  isNewDevice: boolean;
  isNewUser: boolean;
};

const LoginWithEmailOTP: React.FC<ConnectUIPropsWithOptions> = (props) => {
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
    sentEmailInfo.isNewDevice
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <BackButton onClick={props.goBack} />
      <Spacer y="lg" />

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
            Enter the recovery code emailed to you <br /> when you first signed
            up
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
            <Spinner size="md" color="primary" />
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
  );
};

const LinkButton = styled.button<{ theme?: Theme }>`
  all: unset;
  color: ${(p) => p.theme.link.primary};
  font-size: ${fontSize.sm};
  cursor: pointer;
  text-align: center;
  width: 100%;
  &:hover {
    color: ${(p) => p.theme.link.primaryHover};
  }
`;

const Line = styled.div<{ theme?: Theme }>`
  height: 2px;
  background: ${(p) => p.theme.bg.baseHover};
`;
