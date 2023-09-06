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
import { Flex, ScreenContainer } from "../../components/basic";
import { InputSelectionUI } from "./InputSelectionUI";
import { Button } from "../../components/buttons";
import { BackButton, ModalTitle } from "../../components/modalElements";
import { Spacer } from "../../components/Spacer";
import { TextDivider } from "../../components/TextDivider";
import styled from "@emotion/styled";
import { Theme, fontSize, iconSize, spacing } from "../../design-system";
import { GoogleIcon } from "../ConnectWallet/icons/GoogleIcon";
import { FadeIn } from "../../components/FadeIn";
import { OTPInput } from "../../components/OTPInput";
import { Input } from "../../components/formElements";
import { SecondaryText, NeutralText, DangerText } from "../../components/text";

type PaperConfig = Omit<PaperWalletAdditionalOptions, "chain" | "chains">;

type RecoveryShareManagement = Exclude<
  PaperWalletAdditionalOptions["advancedOptions"],
  undefined
>["recoveryShareManagement"];

export const paperWallet = (config: PaperConfig): WalletConfig<PaperWallet> => {
  return {
    category: "socialLogin",
    id: PaperWallet.id,
    meta: {
      ...PaperWallet.meta,
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMwMjEwMTMiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzFfODMpIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01MyAyNC4zMTE1QzUzIDIzLjczODEgNTIuNjMzMSAyMy4yMzA3IDUyLjA5MzEgMjMuMDU3M0wyNyAxNVYyNy4wMzdMNDEuODU3MiAzMS42MDgyTDI5Ljc4NTcgNDBWNTAuMTg1MUwzMi42MDYxIDUzLjEzOTVMMzAuMjEwMSA1NS4zNDkzQzI5LjkzOTggNTUuNTk4NyAyOS43ODU3IDU1Ljk1MTcgMjkuNzg1NyA1Ni4zMjE4VjY1TDM4LjE0MjkgNTguNTE4NlY0OC4zMzMzTDM1LjY0MjQgNDYuMTQzNkw1MyAzNS4zNzA0VjI0LjMxMTVaIiBmaWxsPSIjMTlBOEQ2Ii8+CjxwYXRoIGQ9Ik01MyAyNC4zMTE1QzUzIDIzLjczODEgNTIuNjMzMSAyMy4yMzA3IDUyLjA5MzEgMjMuMDU3M0wyNyAxNVYyNy4wMzdMNTMgMzUuMzcwNFYyNC4zMTE1WiIgZmlsbD0iIzM5RDBGRiIvPgo8cGF0aCBkPSJNMzguMTQyOCA0OC4zMzMzTDI5Ljc4NTcgNDBWNTAuMTg1MUwzOC4xNDI4IDU4LjUxODZWNDguMzMzM1oiIGZpbGw9IiMzOUQwRkYiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8xXzgzIj4KPHJlY3Qgd2lkdGg9IjI2IiBoZWlnaHQ9IjUwIiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjcgMTUpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
    },
    create(options: WalletOptions) {
      return new PaperWallet({ ...options, ...config });
    },
    selectUI: PaperSelectionUI,
    connectUI(props) {
      return (
        <PaperConnectUI
          {...props}
          recoveryShareManagement={
            config.advancedOptions?.recoveryShareManagement
          }
        />
      );
    },
  };
};

const PaperConnectUI = (
  props: ConnectUIProps<PaperWallet> & {
    recoveryShareManagement: RecoveryShareManagement;
  },
) => {
  const [email, setEmail] = useState<string | undefined>(props.selectionData);
  const [screen, setScreen] = useState<"base" | "next">(
    props.modalSize === "wide" ? "base" : "next",
  );

  if (screen === "base") {
    return (
      <PaperFormUIScreen
        onEmail={(_email) => {
          setEmail(_email);
          setScreen("next");
        }}
        onBack={props.goBack}
      />
    );
  }

  if (screen === "next") {
    if (email) {
      return (
        <PaperOTPLoginUI
          {...props}
          recoveryShareManagement={props.recoveryShareManagement}
          selectionData={email}
          goBack={() => {
            // go back to base screen
            if (props.modalSize === "wide") {
              setEmail(undefined);
              setScreen("base");
            }

            // go to main screen
            else {
              props.goBack();
            }
          }}
        />
      );
    }

    return <PaperGoogleLogin {...props} selectionData={email} />;
  }

  return null;
};

const PaperFormUI = (props: {
  onSelect: (input: string | undefined) => void;
  showOrSeparator?: boolean;
  submitType: "inline" | "button";
}) => {
  return (
    <div>
      <OutlineButton
        variant="secondary"
        fullWidth
        onClick={() => {
          props.onSelect(undefined);
        }}
      >
        <GoogleIcon size={iconSize.md} />
        Sign in with Google
      </OutlineButton>

      <Spacer y="lg" />

      <TextDivider>
        <span> OR </span>
      </TextDivider>

      <Spacer y="lg" />

      <InputSelectionUI
        submitType={props.submitType}
        onSelect={props.onSelect}
        placeholder="Sign in with email address"
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
        showOrSeparator={props.showOrSeparator}
      />
    </div>
  );
};

const PaperSelectionUI: React.FC<SelectUIProps<PaperWallet>> = (props) => {
  if (props.modalSize === "wide") {
    return (
      <div>
        <Button
          variant="secondary"
          fullWidth
          onClick={props.onSelect}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: spacing.sm,
          }}
        >
          <GoogleIcon size={iconSize.md} />
          Email or Google
        </Button>
        <Spacer y="lg" />
        <TextDivider>
          <span> OR </span>
        </TextDivider>
        <Spacer y="md" />
      </div>
    );
  }

  return (
    <PaperFormUI
      showOrSeparator={props.supportedWallets.length > 1}
      onSelect={props.onSelect}
      submitType="button"
    />
  );
};

const PaperGoogleLogin: React.FC<ConnectUIProps<PaperWallet>> = ({
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
      <Spinner size="md" color="neutral" />
    </Flex>
  );
};

const PaperFormUIScreen: React.FC<{
  onEmail: (email: string | undefined) => void;
  onBack: () => void;
}> = (props) => {
  return (
    <ScreenContainer>
      <BackButton onClick={props.onBack} />
      <Spacer y="lg" />
      <ModalTitle>Sign in</ModalTitle>
      <Spacer y="lg" />
      <PaperFormUI
        onSelect={(email) => props.onEmail(email)}
        showOrSeparator={false}
        submitType="button"
      />
    </ScreenContainer>
  );
};

type PaperOTPLoginUIProps = ConnectUIProps<PaperWallet> & {
  recoveryShareManagement: RecoveryShareManagement;
};

type SentEmailInfo = {
  isNewDevice: boolean;
  isNewUser: boolean;
};

const PaperOTPLoginUI: React.FC<PaperOTPLoginUIProps> = (props) => {
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

const OutlineButton = /* @__PURE__ */ styled(Button)<{ theme?: Theme }>`
  display: flex;
  justify-content: center;
  gap: ${spacing.sm};
`;
