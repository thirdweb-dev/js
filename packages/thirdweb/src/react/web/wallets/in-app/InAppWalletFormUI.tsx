import styled from "@emotion/styled";
import type {
  InAppWalletAuth,
  InAppWalletSocialAuth,
} from "../../../../wallets/in-app/core/wallet/index.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { useSetSelectionData } from "../../providers/wallet-ui-states-provider.js";
import { TOS } from "../../ui/ConnectWallet/Modal/TOS.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { PoweredByThirdweb } from "../../ui/ConnectWallet/PoweredByTW.js";
import { Img } from "../../ui/components/Img.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { TextDivider } from "../../ui/components/TextDivider.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { useCustomTheme } from "../../ui/design-system/CustomThemeProvider.js";
import { fontSize, iconSize, spacing } from "../../ui/design-system/index.js";
import { InputSelectionUI } from "./InputSelectionUI.js";
import type { InAppWalletLocale } from "./locale/types.js";
import { openOauthSignInWindow } from "./openOauthSignInWindow.js";
import { socialIcons } from "./socialIcons.js";

const defaultAuthOptions: InAppWalletAuth[] = [
  "email",
  "google",
  "apple",
  "facebook",
];

export type InAppWalletFormUIProps = {
  select: () => void;
  locale: InAppWalletLocale;
  done: () => void;
  wallet: Wallet<"inApp">;
  goBack?: () => void;
};

/**
 * @internal
 */
export const InAppWalletFormUI = (props: InAppWalletFormUIProps) => {
  const locale = props.locale;
  const { chain, client, connectModal } = useConnectUI();
  const { done, wallet } = props;
  const setData = useSetSelectionData();

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
  ) as InAppWalletSocialAuth[];

  const hasSocialLogins = socialLogins.length > 0;

  // Need to trigger login on button click to avoid popup from being blocked
  const handleSocialLogin = async (strategy: InAppWalletSocialAuth) => {
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

      setData({
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
                  client={client}
                />
                {!showOnlyIcons && loginMethodsLabel[loginMethod]}
              </SocialButton>
            );
          })}
        </Container>
      )}

      {connectModal.size === "wide" && hasSocialLogins && enableEmailLogin && (
        <TextDivider text={locale.or} />
      )}

      {/* Email Login */}
      {enableEmailLogin && (
        <InputSelectionUI
          onSelect={(email) => {
            setData({
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
export function InAppWalletFormUIScreen(props: InAppWalletFormUIProps) {
  const locale = props.locale.emailLoginScreen;
  const { connectModal } = useConnectUI();
  const isCompact = connectModal.size === "compact";
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
        <InAppWalletFormUI {...props} />
      </Container>

      {isCompact &&
        (connectModal.showThirdwebBranding !== false ||
          connectModal.termsOfServiceUrl ||
          connectModal.privacyPolicyUrl) && <Spacer y="xl" />}

      <Container flex="column" gap="lg">
        <TOS
          termsOfServiceUrl={connectModal.termsOfServiceUrl}
          privacyPolicyUrl={connectModal.privacyPolicyUrl}
        />

        {connectModal.showThirdwebBranding !== false && <PoweredByThirdweb />}
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
