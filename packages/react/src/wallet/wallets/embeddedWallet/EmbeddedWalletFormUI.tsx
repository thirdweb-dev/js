import styled from "@emotion/styled";
import { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import {
  EmbeddedWallet,
  EmbeddedWalletOauthStrategy,
} from "@thirdweb-dev/wallets";
import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { TextDivider } from "../../../components/TextDivider";
import { Container, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { fontSize, iconSize, spacing } from "../../../design-system";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { openOauthSignInWindow } from "../../utils/openOauthSignInWindow";
import { InputSelectionUI } from "../InputSelectionUI";
import { socialIcons } from "./socialIcons";
import type { AuthOption, EmbeddedWalletLoginType } from "./types";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";

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

  const enableEmailLogin = props.authOptions.includes("email");

  const socialLogins = props.authOptions.filter(
    (x) => x !== "email",
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
    <Container flex="column" gap="lg">
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

      {props.modalSize === "wide" && hasSocialLogins && enableEmailLogin && (
        <TextDivider text={twLocale.connectWallet.or} />
      )}

      {/* Email Login */}
      {enableEmailLogin && (
        <InputSelectionUI
          onSelect={(email) => props.onSelect({ email })}
          placeholder={locale.emailPlaceholder}
          name="email"
          type="email"
          errorMessage={(_input) => {
            const input = _input.replace(/\+/g, "");
            const emailRegex =
              /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
            const isValidEmail = emailRegex.test(input);
            if (!isValidEmail) {
              return locale.invalidEmail;
            }
          }}
          emptyErrorMessage={locale.emailRequired}
          submitButtonText={locale.submitEmail}
        />
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
  const locale = useTWLocale().wallets.embeddedWallet.emailLoginScreen;
  const isCompact = props.modalSize === "compact";
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
      <ModalHeader onBack={props.onBack} title={locale.title} />
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
