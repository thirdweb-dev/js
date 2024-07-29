"use client";
import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { getEcosystemWalletAuthOptions } from "../../../../wallets/ecosystem/get-ecosystem-wallet-auth-options.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
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
import {
  emailIcon,
  passkeyIcon,
  phoneIcon,
  socialIcons,
} from "../../../core/utils/socialIcons.js";
import { setLastAuthProvider } from "../../../core/utils/storage.js";
import { useSetSelectionData } from "../../providers/wallet-ui-states-provider.js";
import { WalletTypeRowButton } from "../../ui/ConnectWallet/WalletTypeRowButton.js";
import { Img } from "../../ui/components/Img.js";
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
        connectionPromise: Promise<Account>;
      };
      passkeyLogin?: boolean;
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

  const loginMethodsLabel = {
    google: locale.signInWithGoogle,
    facebook: locale.signInWithFacebook,
    apple: locale.signInWithApple,
    discord: locale.signInWithDiscord,
    farcaster: "Farcaster",
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
    if (
      walletConfig &&
      "auth" in walletConfig &&
      walletConfig?.auth?.mode === "redirect"
    ) {
      return loginWithOauthRedirect({
        authOption: strategy,
        client: props.client,
        ecosystem: ecosystemInfo,
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

      const connectPromise = isEcosystemWallet(wallet)
        ? wallet.connect({
            ...connectOptions,
            ecosystem: {
              id: wallet.id,
              partnerId: wallet.getConfig()?.partnerId,
            },
          })
        : wallet.connect(connectOptions);

      await setLastAuthProvider(strategy, webLocalStorage);

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

  const showOnlyIcons = socialLogins.length > 1;

  return (
    <Container
      flex="column"
      gap="md"
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
                variant={"outline"}
                fullWidth={!showOnlyIcons}
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
                  loginMethodsLabel[loginMethod as SocialAuthOption]}
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
              client={props.client}
              icon={phoneIcon}
              onClick={() => {
                setManualInputMode("phone");
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
            client={props.client}
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
