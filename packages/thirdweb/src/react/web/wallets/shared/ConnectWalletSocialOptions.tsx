"use client";
import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { getEcosystemWalletAuthOptions } from "../../../../wallets/ecosystem/get-ecosystem-wallet-auth-options.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Profile } from "../../../../wallets/in-app/core/authentication/types.js";
import { linkProfile } from "../../../../wallets/in-app/core/wallet/profiles.js";
import { loginWithOauthRedirect } from "../../../../wallets/in-app/web/lib/auth/oauth.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  type AuthOption,
  type SocialAuthOption,
  socialAuthOptions,
} from "../../../../wallets/types.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../core/design-system/index.js";
import { setLastAuthProvider } from "../../../core/utils/storage.js";
import {
  emailIcon,
  getWalletIcon,
  passkeyIcon,
  phoneIcon,
  socialIcons,
} from "../../../core/utils/walletIcon.js";
import { useSetSelectionData } from "../../providers/wallet-ui-states-provider.js";
import { WalletTypeRowButton } from "../../ui/ConnectWallet/WalletTypeRowButton.js";
import { Img } from "../../ui/components/Img.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { TextDivider } from "../../ui/components/TextDivider.js";
import { Container } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { InputSelectionUI } from "../in-app/InputSelectionUI.js";
import { validateEmail } from "../in-app/validateEmail.js";
import { LoadingScreen } from "./LoadingScreen.js";
import type { InAppWalletLocale } from "./locale/types.js";
import { openOauthSignInWindow } from "./oauthSignIn.js";

export type ConnectWalletSelectUIState =
  | undefined
  | {
      emailLogin?: string;
      phoneLogin?: string;
      socialLogin?: {
        type: SocialAuthOption;
        connectionPromise: Promise<Account | Profile[]>;
      };
      passkeyLogin?: boolean;
      walletLogin?: boolean;
    };

const defaultAuthOptions: AuthOption[] = [
  "email",
  "phone",
  "google",
  "apple",
  "facebook",
  "passkey",
];

export type ConnectWalletSocialOptionsProps = {
  select: () => void;
  done: () => void;
  locale: InAppWalletLocale;
  wallet: Wallet<EcosystemWalletId> | Wallet<"inApp">;
  goBack?: () => void;
  chain: Chain | undefined;
  client: ThirdwebClient;
  size: "compact" | "wide";
  isLinking?: boolean;
  // If true, all options will be disabled. Used for things like requiring TOS approval.
  disabled?: boolean;
};

/**
 * @internal
 */
export const ConnectWalletSocialOptions = (
  props: ConnectWalletSocialOptionsProps,
) => {
  const locale = props.locale;
  const { wallet } = props;
  const setData = useSetSelectionData() as (
    value: ConnectWalletSelectUIState,
  ) => void;

  const themeObj = useCustomTheme();
  const optionalImageMetadata = useMemo(
    () =>
      props.wallet.id === "inApp"
        ? props.wallet.getConfig()?.metadata?.image
        : undefined,
    [props.wallet],
  );

  const loginMethodsLabel = {
    google: locale.signInWithGoogle,
    facebook: locale.signInWithFacebook,
    apple: locale.signInWithApple,
    discord: locale.signInWithDiscord,
    farcaster: "Farcaster",
    telegram: "Telegram",
  };

  const { data: ecosystemAuthOptions, isLoading } = useQuery({
    queryKey: ["auth-options", wallet.id],
    queryFn: async () => {
      if (isEcosystemWallet(wallet)) {
        return getEcosystemWalletAuthOptions(wallet.id);
      }
      return null;
    },
    enabled: isEcosystemWallet(wallet),
    retry: false,
  });
  const authOptions = isEcosystemWallet(wallet)
    ? ecosystemAuthOptions ?? defaultAuthOptions
    : wallet.getConfig()?.auth?.options ?? defaultAuthOptions;

  const emailIndex = authOptions.indexOf("email");
  const isEmailEnabled = emailIndex !== -1;
  const phoneIndex = authOptions.indexOf("phone");
  const isPhoneEnabled = phoneIndex !== -1;

  const [manualInputMode, setManualInputMode] = useState<
    "email" | "phone" | "none" | null
  >(null);

  const inputMode = useMemo(() => {
    if (manualInputMode) {
      return manualInputMode;
    }
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
  }, [isEmailEnabled, isPhoneEnabled, emailIndex, phoneIndex, manualInputMode]);

  if (isEcosystemWallet(wallet) && isLoading) {
    return <LoadingScreen />;
  }

  const passKeyEnabled = authOptions.includes("passkey");

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

  const socialLogins = authOptions.filter((o) =>
    socialAuthOptions.includes(o as SocialAuthOption),
  );

  const hasSocialLogins = socialLogins.length > 0;
  const ecosystemInfo = isEcosystemWallet(wallet)
    ? {
        id: wallet.id,
        partnerId: wallet.getConfig()?.partnerId,
      }
    : undefined;

  // Need to trigger login on button click to avoid popup from being blocked
  const handleSocialLogin = async (strategy: SocialAuthOption) => {
    const walletConfig = wallet.getConfig();
    const authMode = walletConfig?.auth?.mode ?? "popup";
    if (
      walletConfig &&
      "auth" in walletConfig &&
      authMode !== "popup" &&
      !props.isLinking // We do not support redirects for linking
    ) {
      return loginWithOauthRedirect({
        authOption: strategy,
        client: props.client,
        ecosystem: ecosystemInfo,
        redirectUrl: walletConfig?.auth?.redirectUrl,
        mode: authMode,
      });
    }

    try {
      const socialLoginWindow = openOauthSignInWindow({
        authOption: strategy,
        themeObj,
        client: props.client,
        ecosystem: ecosystemInfo,
      });
      if (!socialLoginWindow) {
        throw new Error("Failed to open login window");
      }
      const connectOptions = {
        chain: props.chain,
        client: props.client,
        strategy,
        openedWindow: socialLoginWindow,
        closeOpenedWindow: (openedWindow: Window) => {
          openedWindow.close();
        },
      };

      const connectPromise = (() => {
        if (props.isLinking) {
          if (wallet.id !== "inApp") {
            throw new Error("Only in-app wallets support multi-auth");
          }
          return linkProfile(wallet, connectOptions);
        } else {
          const connectPromise = wallet.connect(connectOptions);
          setLastAuthProvider(strategy, webLocalStorage);
          return connectPromise;
        }
      })();

      setData({
        socialLogin: {
          type: strategy,
          connectionPromise: connectPromise,
        },
      });

      props.select(); // show Connect UI

      // Note: do not call done() here, it will be called SocialLogin component
      // we simply trigger the connect and save promise here - its resolution is handled in SocialLogin
    } catch (e) {
      console.error(`Error signing in with ${strategy}`, e);
    }
  };

  function handlePassKeyLogin() {
    setData({
      passkeyLogin: true,
    });
    props.select();
  }

  function handleWalletLogin() {
    setData({
      walletLogin: true,
    });
    props.select();
  }

  const showOnlyIcons = socialLogins.length > 2;

  return (
    <Container
      flex="column"
      gap="md"
      style={{
        position: "relative",
      }}
    >
      {optionalImageMetadata && (
        <>
          <Img
            client={props.client}
            src={optionalImageMetadata.src}
            alt={optionalImageMetadata.alt}
            width={`${optionalImageMetadata.width}`}
            height={`${optionalImageMetadata.height}`}
            style={{ margin: "auto" }}
          />
          <Spacer y="xxs" />
        </>
      )}
      {/* Social Login */}
      {hasSocialLogins && (
        <Container
          flex="row"
          center="x"
          gap={socialLogins.length > 4 ? "xs" : "sm"}
          style={{
            justifyContent: "space-between",
            display: "grid",
            gridTemplateColumns: `repeat(${socialLogins.length}, 1fr)`,
          }}
        >
          {socialLogins.map((loginMethod) => {
            const imgIconSize = (() => {
              if (!showOnlyIcons) {
                return iconSize.md;
              } else {
                if (socialLogins.length > 4) {
                  return iconSize.md;
                }
                return iconSize.lg;
              }
            })();

            return (
              <SocialButton
                aria-label={`Login with ${loginMethod}`}
                data-variant={showOnlyIcons ? "icon" : "full"}
                key={loginMethod}
                variant={"outline"}
                disabled={props.disabled}
                onClick={() => {
                  handleSocialLogin(loginMethod as SocialAuthOption);
                }}
              >
                <Img
                  src={socialIcons[loginMethod as SocialAuthOption]}
                  width={imgIconSize}
                  height={imgIconSize}
                  client={props.client}
                />
                {!showOnlyIcons &&
                  `${socialLogins.length === 1 ? "Continue with " : ""}${loginMethodsLabel[loginMethod as SocialAuthOption]}`}
              </SocialButton>
            );
          })}
        </Container>
      )}

      {props.size === "wide" &&
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
              disabled={props.disabled}
              emptyErrorMessage={emptyErrorMessage}
              submitButtonText={locale.submitEmail}
            />
          ) : (
            <WalletTypeRowButton
              client={props.client}
              icon={emailIcon}
              onClick={() => {
                setManualInputMode("email");
              }}
              title={locale.emailPlaceholder}
              disabled={props.disabled}
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
              disabled={props.disabled}
              emptyErrorMessage={emptyErrorMessage}
              submitButtonText={locale.submitEmail}
            />
          ) : (
            <WalletTypeRowButton
              client={props.client}
              icon={phoneIcon}
              onClick={() => {
                setManualInputMode("phone");
              }}
              title={locale.phonePlaceholder}
              disabled={props.disabled}
            />
          )}
        </>
      )}

      {passKeyEnabled && (
        <>
          <WalletTypeRowButton
            client={props.client}
            icon={passkeyIcon}
            onClick={() => {
              handlePassKeyLogin();
            }}
            title={locale.passkey}
            disabled={props.disabled}
          />
        </>
      )}

      {props.isLinking && (
        <>
          <WalletTypeRowButton
            client={props.client}
            icon={getWalletIcon("")}
            onClick={() => {
              handleWalletLogin();
            }}
            title={locale.linkWallet}
          />
        </>
      )}
    </Container>
  );
};

const SocialButton = /* @__PURE__ */ styled(Button)({
  flexGrow: 1,
  "&[data-variant='full']": {
    display: "flex",
    justifyContent: "flex-start",
    padding: spacing.md,
    gap: spacing.sm,
    fontSize: fontSize.md,
    fontWeight: 500,
    transition: "background-color 0.2s ease",
    "&:active": {
      boxShadow: "none",
    },
  },
  "&[data-variant='icon']": {
    padding: spacing.sm,
  },
});
