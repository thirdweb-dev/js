import styled from "@emotion/styled";
import { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import {
  EmbeddedWallet,
  EmbeddedWalletOauthStrategy,
} from "@thirdweb-dev/wallets";
import { useCallback, useContext, useState } from "react";
import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { TextDivider } from "../../../components/TextDivider";
import { Container, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { fontSize, iconSize, spacing } from "../../../design-system";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { TOS } from "../../ConnectWallet/Modal/TOS";
import { useScreenContext } from "../../ConnectWallet/Modal/screen";
import { PoweredByThirdweb } from "../../ConnectWallet/PoweredByTW";
import { openOauthSignInWindow } from "../../utils/openOauthSignInWindow";
import { validateEmail } from "../../utils/validateEmail";
import { InputSelectionUI } from "../InputSelectionUI";
import { LinkButton } from "./LinkButton";
import { socialIcons } from "./socialIcons";
import type { AuthOption, EmbeddedWalletLoginType } from "./types";

export const EmbeddedWalletFormUI = (props: {
  onSelect: (loginType: EmbeddedWalletLoginType) => void;
  walletConfig: WalletConfig<EmbeddedWallet>;
  authOptions: AuthOption[];
  modalSize: "compact" | "wide";
  createWalletInstance: ConnectUIProps<EmbeddedWallet>["createWalletInstance"];
  setConnectionStatus: ConnectUIProps<EmbeddedWallet>["setConnectionStatus"];
  setConnectedWallet: ConnectUIProps<EmbeddedWallet>["setConnectedWallet"];
}) => {
  const twLocale = useTWLocale();
  const locale = twLocale.wallets.embeddedWallet;

  const { createWalletInstance, setConnectionStatus, setConnectedWallet } =
    props;

  const themeObj = useCustomTheme();

  const loginMethodsLabel: Record<EmbeddedWalletOauthStrategy, string> = {
    google: locale.signInWithGoogle,
    facebook: locale.signInWithFacebook,
    apple: locale.signInWithApple,
  };

  const emailIndex = props.authOptions.indexOf("email");
  const isEmailEnabled = emailIndex !== -1;
  const phoneIndex = props.authOptions.indexOf("phone");
  const isPhoneEnabled = phoneIndex !== -1;

  const selectDefaultInputMode = () => {
    if (isEmailEnabled && isPhoneEnabled) {
      return emailIndex < phoneIndex ? "email" : "phone";
    } else if (isEmailEnabled) {
      return "email";
    } else if (isPhoneEnabled) {
      return "phone";
    }
    return "none";
  };
  const [inputMode, setInputMode] = useState<"email" | "phone" | "none">(
    selectDefaultInputMode(),
  );

  const placeholder =
    inputMode === "email" ? locale.emailPlaceholder : locale.phonePlaceholder;
  const emptyErrorMessage =
    inputMode === "email" ? locale.emailRequired : locale.phoneRequired;

  let type = "text";
  if (inputMode === "email") {
    type = "email";
  } else if (inputMode === "phone") {
    type = "tel";
  }

  const switchInputModeText =
    inputMode === "email" ? locale.signInWithPhone : locale.signInWithEmail;
  const switchInputMode = useCallback(() => {
    setInputMode((prev) => (prev === "email" ? "phone" : "email"));
  }, []);
  const allowSwitchInputMode = isEmailEnabled && isPhoneEnabled;

  const socialLogins = props.authOptions.filter(
    (x) => x !== "email" && x !== "phone",
  ) as EmbeddedWalletOauthStrategy[];

  const hasSocialLogins = socialLogins.length > 0;

  // Need to trigger login on button click to avoid popup from being blocked
  const socialLogin = async (strategy: EmbeddedWalletOauthStrategy) => {
    try {
      const embeddedWallet = createWalletInstance();
      setConnectionStatus("connecting");

      const socialLoginWindow = openOauthSignInWindow(strategy, themeObj);
      if (!socialLoginWindow) {
        throw new Error("Failed to open login window");
      }
      const authResult = await embeddedWallet.authenticate({
        strategy: strategy,
        openedWindow: socialLoginWindow,
        closeOpenedWindow: (openedWindow) => {
          openedWindow.close();
        },
      });
      await embeddedWallet.connect({
        authResult,
      });
      setConnectedWallet(embeddedWallet);
    } catch (e) {
      setConnectionStatus("disconnected");
      console.error(`Error sign in with ${strategy}`, e);
    }
  };

  const showOnlyIcons = socialLogins.length > 1;

  return (
    <Container
      flex="column"
      gap="lg"
      style={{
        position: "relative",
      }}
    >
      {/* Social Login */}
      {hasSocialLogins && (
        <Container
          flex={showOnlyIcons ? "row" : "column"}
          center="x"
          gap="sm"
          style={{
            justifyContent: "space-between",
          }}
        >
          {socialLogins.map((loginMethod) => {
            const imgIconSize = showOnlyIcons ? iconSize.lg : iconSize.md;
            return (
              <SocialButton
                aria-label={`Login with ${loginMethod}`}
                data-variant={showOnlyIcons ? "icon" : "full"}
                key={loginMethod}
                variant={showOnlyIcons ? "outline" : "secondary"}
                fullWidth={!showOnlyIcons}
                onClick={() => {
                  socialLogin(loginMethod);
                  props.onSelect(loginMethod);
                }}
              >
                <Img
                  src={socialIcons[loginMethod]}
                  width={imgIconSize}
                  height={imgIconSize}
                />
                {!showOnlyIcons && loginMethodsLabel[loginMethod]}
              </SocialButton>
            );
          })}
        </Container>
      )}

      {props.modalSize === "wide" && hasSocialLogins && isEmailEnabled && (
        <TextDivider text={twLocale.connectWallet.or} />
      )}

      {/* Email Login */}
      {inputMode !== "none" && (
        <Container>
          {inputMode === "email" ? (
            <InputSelectionUI
              type={type}
              onSelect={(value) => {
                props.onSelect({ email: value });
              }}
              placeholder={placeholder}
              name="email"
              errorMessage={(input) => {
                const isValidEmail = validateEmail(input.toLowerCase());
                if (!isValidEmail) {
                  return locale.invalidEmail;
                }
              }}
              emptyErrorMessage={emptyErrorMessage}
              submitButtonText={locale.submitEmail}
            />
          ) : (
            <InputSelectionUI
              format="phone"
              type={type}
              onSelect={(value) => {
                // removes white spaces and special characters
                props.onSelect({ phone: value.replace(/[-\(\) ]/g, "") });
              }}
              placeholder={placeholder}
              name="phone"
              errorMessage={(_input) => {
                // removes white spaces and special characters
                const input = _input.replace(/[-\(\) ]/g, "");
                const isPhone = /^[0-9]+$/.test(input);

                if (!isPhone && isPhoneEnabled) {
                  return locale.invalidPhone;
                }
              }}
              emptyErrorMessage={emptyErrorMessage}
              submitButtonText={locale.submitEmail}
            />
          )}
          {allowSwitchInputMode && (
            <>
              <Spacer y="md" />
              <LinkButton onClick={switchInputMode} type="button">
                {switchInputModeText}
              </LinkButton>
            </>
          )}
        </Container>
      )}
    </Container>
  );
};

export const EmbeddedWalletFormUIScreen: React.FC<{
  onSelect: (loginType: EmbeddedWalletLoginType) => void;
  onBack: () => void;
  modalSize: "compact" | "wide";
  walletConfig: WalletConfig<EmbeddedWallet>;
  authOptions: AuthOption[];
  createWalletInstance: ConnectUIProps<EmbeddedWallet>["createWalletInstance"];
  setConnectionStatus: ConnectUIProps<EmbeddedWallet>["setConnectionStatus"];
  setConnectedWallet: ConnectUIProps<EmbeddedWallet>["setConnectedWallet"];
}> = (props) => {
  const locale = useTWLocale().wallets.embeddedWallet.otpLoginScreen;
  const isCompact = props.modalSize === "compact";
  const { initialScreen, screen } = useScreenContext();
  const modalConfig = useContext(ModalConfigCtx);

  return (
    <Container
      fullHeight
      flex="column"
      p="lg"
      animate="fadein"
      style={{
        minHeight: "250px",
      }}
    >
      <ModalHeader
        onBack={
          screen === props.walletConfig && initialScreen === props.walletConfig
            ? undefined
            : props.onBack
        }
        title={locale.title}
      />
      {isCompact ? <Spacer y="xl" /> : null}

      <Container
        expand
        flex="column"
        center="y"
        p={isCompact ? undefined : "lg"}
      >
        <EmbeddedWalletFormUI
          modalSize={props.modalSize}
          authOptions={props.authOptions}
          walletConfig={props.walletConfig}
          onSelect={props.onSelect}
          createWalletInstance={props.createWalletInstance}
          setConnectionStatus={props.setConnectionStatus}
          setConnectedWallet={props.setConnectedWallet}
        />
      </Container>

      {isCompact &&
        (modalConfig.showThirdwebBranding !== false ||
          modalConfig.termsOfServiceUrl ||
          modalConfig.privacyPolicyUrl) && <Spacer y="xl" />}

      <Container flex="column" gap="lg">
        <TOS
          termsOfServiceUrl={modalConfig.termsOfServiceUrl}
          privacyPolicyUrl={modalConfig.privacyPolicyUrl}
        />

        {modalConfig.showThirdwebBranding !== false && <PoweredByThirdweb />}
      </Container>
    </Container>
  );
};

const SocialButton = /* @__PURE__ */ styled(Button)({
  "&[data-variant='full']": {
    display: "flex",
    justifyContent: "center",
    gap: spacing.md,
    fontSize: fontSize.md,
    transition: "background-color 0.2s ease",
    "&:active": {
      boxShadow: "none",
    },
  },
  "&[data-variant='icon']": {
    padding: spacing.sm,
    flexGrow: 1,
  },
});
