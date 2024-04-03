import styled from "@emotion/styled";
import { useContext } from "react";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
} from "../../providers/wallet-ui-states-provider.js";
import { TOS } from "../../ui/ConnectWallet/Modal/TOS.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { PoweredByThirdweb } from "../../ui/ConnectWallet/PoweredByTW.js";
import { Img } from "../../ui/components/Img.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { TextDivider } from "../../ui/components/TextDivider.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { useCustomTheme } from "../../ui/design-system/CustomThemeProvider.js";
import { iconSize, spacing, fontSize } from "../../ui/design-system/index.js";
import { socialIcons } from "./socialIcons.js";
import type { EmbeddedWalletSelectUIState } from "./types.js";
import { openOauthSignInWindow } from "./openOauthSignInWindow.js";
import type { EmbeddedWalletLocale } from "./locale/types.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { InputSelectionUI } from "./InputSelectionUI.js";
import type {
  EmbeddedWalletAuth,
  EmbeddedWalletSocialAuth,
} from "../../../../wallets/embedded/core/wallet/index.js";

const defaultAuthOptions: EmbeddedWalletAuth[] = [
  "email",
  "google",
  "apple",
  "facebook",
];

export type EmbeddedWalletFormUIProps = {
  // authOptions: EmbeddedWalletAuth[];
  select: () => void;
  locale: EmbeddedWalletLocale;
  done: () => void;
  wallet: Wallet<"embedded">;
  goBack?: () => void;
};

/**
 * @internal
 */
export const EmbeddedWalletFormUI = (props: EmbeddedWalletFormUIProps) => {
  const locale = props.locale;
  const { chain, client } = useWalletConnectionCtx();
  const { done, wallet } = props;
  const { modalSize } = useContext(ModalConfigCtx);
  const setModalConfig = useContext(SetModalConfigCtx);

  function saveState(data: EmbeddedWalletSelectUIState) {
    setModalConfig((p) => ({
      ...p,
      data,
    }));
  }

  const themeObj = useCustomTheme();

  const loginMethodsLabel = {
    google: locale.signInWithGoogle,
    facebook: locale.signInWithFacebook,
    apple: locale.signInWithApple,
  };

  const config = props.wallet.getConfig();

  const authOptions = config?.auth?.options || defaultAuthOptions;
  const enableEmailLogin = authOptions.includes("email");

  const socialLogins = authOptions.filter(
    (x) => x !== "email",
  ) as EmbeddedWalletSocialAuth[];

  const hasSocialLogins = socialLogins.length > 0;

  // Need to trigger login on button click to avoid popup from being blocked
  const handleSocialLogin = async (strategy: EmbeddedWalletSocialAuth) => {
    try {
      const socialLoginWindow = openOauthSignInWindow(strategy, themeObj);
      if (!socialLoginWindow) {
        throw new Error("Failed to open login window");
      }

      const connectPromise = wallet.connect({
        chain,
        client,
        strategy: strategy,
        openedWindow: socialLoginWindow,
        closeOpenedWindow: (openedWindow) => {
          openedWindow.close();
        },
      });

      saveState({
        socialLogin: {
          type: strategy,
          connectionPromise: connectPromise,
        },
      });
      props.select();

      await connectPromise;
      done();
    } catch (e) {
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
                  handleSocialLogin(loginMethod);
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

      {modalSize === "wide" && hasSocialLogins && enableEmailLogin && (
        <TextDivider text={locale.or} />
      )}

      {/* Email Login */}
      {enableEmailLogin && (
        <InputSelectionUI
          onSelect={(email) => {
            saveState({
              emailLogin: email,
            });
            props.select();
          }}
          placeholder={locale.emailPlaceholder}
          name="email"
          type="email"
          errorMessage={(_input) => {
            const input = _input.replace(/\+/g, "").toLowerCase();
            const emailRegex =
              /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
            const isValidEmail = emailRegex.test(input);
            if (!isValidEmail) {
              return locale.invalidEmail;
            }

            return undefined;
          }}
          emptyErrorMessage={locale.emailRequired}
          submitButtonText={locale.submitEmail}
        />
      )}
    </Container>
  );
};

/**
 * @internal
 */
export function EmbeddedWalletFormUIScreen(props: EmbeddedWalletFormUIProps) {
  const locale = props.locale.emailLoginScreen;
  const modalConfig = useContext(ModalConfigCtx);
  const isCompact = modalConfig.modalSize === "compact";
  const { initialScreen, screen } = useScreenContext();

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
          screen === props.wallet && initialScreen === props.wallet
            ? undefined
            : props.goBack
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
        <EmbeddedWalletFormUI {...props} />
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
}

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
