"use client";
import styled from "@emotion/styled";
import { useState } from "react";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import type {
  InAppWalletAuth,
  InAppWalletSocialAuth,
} from "../../../../wallets/in-app/core/wallet/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../core/design-system/index.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { useSetSelectionData } from "../../providers/wallet-ui-states-provider.js";
import { TOS } from "../../ui/ConnectWallet/Modal/TOS.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { PoweredByThirdweb } from "../../ui/ConnectWallet/PoweredByTW.js";
import { WalletTypeRowButton } from "../../ui/ConnectWallet/WalletTypeRowButton.js";
import {
  emailIcon,
  passkeyIcon,
  phoneIcon,
} from "../../ui/ConnectWallet/icons/dataUris.js";
import { Img } from "../../ui/components/Img.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { TextDivider } from "../../ui/components/TextDivider.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { ModalTitle } from "../../ui/components/modalElements.js";
import { InputSelectionUI } from "./InputSelectionUI.js";
import type { InAppWalletLocale } from "./locale/types.js";
import { openOauthSignInWindow } from "./openOauthSignInWindow.js";
import { socialIcons } from "./socialIcons.js";
import { setLastAuthProvider } from "./storage.js";
import type { InAppWalletSelectUIState } from "./types.js";
import { validateEmail } from "./validateEmail.js";

const defaultAuthOptions: InAppWalletAuth[] = [
  "email",
  "phone",
  "google",
  "apple",
  "facebook",
  "passkey",
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
  const { wallet } = props;
  const setData = useSetSelectionData() as (
    value: InAppWalletSelectUIState,
  ) => void;

  const themeObj = useCustomTheme();

  const loginMethodsLabel = {
    google: locale.signInWithGoogle,
    facebook: locale.signInWithFacebook,
    apple: locale.signInWithApple,
  };

  const config = props.wallet.getConfig();
  const authOptions = config?.auth?.options || defaultAuthOptions;
  const passKeyEnabled = authOptions.includes("passkey");

  const emailIndex = authOptions.indexOf("email");
  const isEmailEnabled = emailIndex !== -1;
  const phoneIndex = authOptions.indexOf("phone");
  const isPhoneEnabled = phoneIndex !== -1;

  const [inputMode, setInputMode] = useState<"email" | "phone" | "none">(() => {
    if (isEmailEnabled && isPhoneEnabled) {
      return emailIndex < phoneIndex ? "email" : "phone";
    }
    if (isEmailEnabled) {
      return "email";
    }
    if (isPhoneEnabled) {
      return "phone";
    }
    return "none";
  });

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

  const socialLogins = authOptions.filter(
    (x) => x === "google" || x === "apple" || x === "facebook",
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

      await setLastAuthProvider(strategy, webLocalStorage);

      setData({
        socialLogin: {
          type: strategy,
          connectionPromise: connectPromise,
        },
      });

      props.select(); // show Connect UI

      // Note: do not call done() here, it will be called InAppWalletSocialLogin component
      // we simply trigger the connect and save promise here - its resolution is handled in InAppWalletSocialLogin
    } catch (e) {
      console.error(`Error sign in with ${strategy}`, e);
    }
  };

  function handlePassKeyLogin() {
    setData({
      passkeyLogin: true,
    });
    props.select();
  }

  const showOnlyIcons = socialLogins.length > 1;

  if (
    config?.metadata?.image &&
    (!config.metadata.image.height || !config.metadata.image.width)
  ) {
    console.warn(
      "Image is not properly configured. Please set height and width.",
      config.metadata.image,
    );
  }

  return (
    <Container
      flex="column"
      gap="md"
      style={{
        position: "relative",
      }}
    >
      {config?.metadata?.image && (
        <Container flex="row" center="both">
          <Img
            loading="eager"
            client={client}
            style={{
              maxHeight: "100px",
              maxWidth: "300px",
            }}
            src={config.metadata.image.src}
            alt={config.metadata.image.alt}
            width={Math.min(
              config.metadata.image.width ?? 300,
              300,
            )?.toString()}
            height={Math.min(
              config.metadata.image.height ?? 100,
              100,
            )?.toString()}
          />
        </Container>
      )}

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
                variant={"outline"}
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

      {connectModal.size === "wide" &&
        hasSocialLogins &&
        (isEmailEnabled || isPhoneEnabled) && <TextDivider text={locale.or} />}

      {/* Email/Phone Login */}
      {isEmailEnabled && (
        <>
          {inputMode === "email" ? (
            <InputSelectionUI
              type={type}
              onSelect={(value) => {
                setData({ emailLogin: value });
                props.select();
              }}
              placeholder={placeholder}
              name="email"
              errorMessage={(input) => {
                const isValidEmail = validateEmail(input.toLowerCase());
                if (!isValidEmail) {
                  return locale.invalidEmail;
                }
                return undefined;
              }}
              emptyErrorMessage={emptyErrorMessage}
              submitButtonText={locale.submitEmail}
            />
          ) : (
            <WalletTypeRowButton
              client={client}
              icon={emailIcon}
              onClick={() => {
                setInputMode("email");
              }}
              // TODO locale
              title={"Email address"}
            />
          )}
        </>
      )}
      {isPhoneEnabled && (
        <>
          {inputMode === "phone" ? (
            <InputSelectionUI
              format="phone"
              type={type}
              onSelect={(value) => {
                // removes white spaces and special characters
                setData({ phoneLogin: value.replace(/[-\(\) ]/g, "") });
                props.select();
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

                return undefined;
              }}
              emptyErrorMessage={emptyErrorMessage}
              submitButtonText={locale.submitEmail}
            />
          ) : (
            <WalletTypeRowButton
              client={client}
              icon={phoneIcon}
              onClick={() => {
                setInputMode("phone");
              }}
              // TODO locale
              title={"Phone number"}
            />
          )}
        </>
      )}

      {passKeyEnabled && (
        <>
          <WalletTypeRowButton
            client={client}
            icon={passkeyIcon}
            onClick={() => {
              handlePassKeyLogin();
            }}
            // TODO locale
            title="Passkey"
          />
        </>
      )}
    </Container>
  );
};

/**
 * @internal
 */
export function InAppWalletFormUIScreen(props: InAppWalletFormUIProps) {
  const locale = props.locale.emailLoginScreen;
  const { connectModal, client } = useConnectUI();
  const isCompact = connectModal.size === "compact";
  const { initialScreen, screen } = useScreenContext();

  const onBack =
    screen === props.wallet && initialScreen === props.wallet
      ? undefined
      : props.goBack;

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
      {isCompact ? (
        <>
          <ModalHeader
            onBack={onBack}
            title={
              <>
                {!connectModal.titleIcon ? null : (
                  <Img
                    src={connectModal.titleIcon}
                    width={iconSize.md}
                    height={iconSize.md}
                    client={client}
                  />
                )}
                <ModalTitle>{connectModal.title ?? locale.title}</ModalTitle>
              </>
            }
          />
          <Spacer y="lg" />
        </>
      ) : null}

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
    justifyContent: "flex-start",
    padding: spacing.md,
    gap: spacing.md,
    fontSize: fontSize.md,
    fontWeight: 500,
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
