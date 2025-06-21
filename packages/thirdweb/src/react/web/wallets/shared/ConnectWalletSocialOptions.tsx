"use client";
import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { getEcosystemInfo } from "../../../../wallets/ecosystem/get-ecosystem-wallet-auth-options.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Profile } from "../../../../wallets/in-app/core/authentication/types.js";
import { linkProfile } from "../../../../wallets/in-app/web/lib/auth/index.js";
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
import { socialIcons } from "../../../core/utils/walletIcon.js";
import { useSetSelectionData } from "../../providers/wallet-ui-states-provider.js";
import { EmailIcon } from "../../ui/ConnectWallet/icons/EmailIcon.js";
import { FingerPrintIcon } from "../../ui/ConnectWallet/icons/FingerPrintIcon.js";
import { GuestIcon } from "../../ui/ConnectWallet/icons/GuestIcon.js";
import { OutlineWalletIcon } from "../../ui/ConnectWallet/icons/OutlineWalletIcon.js";
import { PhoneIcon } from "../../ui/ConnectWallet/icons/PhoneIcon.js";
import { WalletTypeRowButton } from "../../ui/ConnectWallet/WalletTypeRowButton.js";
import { Container } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Img } from "../../ui/components/Img.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { TextDivider } from "../../ui/components/TextDivider.js";
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
      guestLogin?: {
        connectionPromise: Promise<Account | Profile[]>;
      };
      passkeyLogin?: boolean;
      walletLogin?: {
        linking: boolean;
      };
    };

const defaultAuthOptions: AuthOption[] = [
  "email",
  "phone",
  "google",
  "apple",
  "facebook",
  "passkey",
];

type ConnectWalletSocialOptionsProps = {
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
    apple: locale.signInWithApple,
    coinbase: "Coinbase",
    discord: locale.signInWithDiscord,
    facebook: locale.signInWithFacebook,
    farcaster: "Farcaster",
    github: "GitHub",
    google: locale.signInWithGoogle,
    line: "LINE",
    steam: "Steam",
    telegram: "Telegram",
    twitch: "Twitch",
    x: "X",
  };

  const { data: ecosystemAuthOptions, isLoading } = useQuery({
    enabled: isEcosystemWallet(wallet),
    queryFn: async () => {
      if (isEcosystemWallet(wallet)) {
        const options = await getEcosystemInfo(wallet.id);
        return options?.authOptions ?? null;
      }
      return null;
    },
    queryKey: ["auth-options", wallet.id],
    retry: false,
  });
  const authOptions = isEcosystemWallet(wallet)
    ? (ecosystemAuthOptions ?? defaultAuthOptions)
    : (wallet.getConfig()?.auth?.options ?? defaultAuthOptions);

  const emailIndex = authOptions.indexOf("email");
  const isEmailEnabled = emailIndex !== -1;
  const phoneIndex = authOptions.indexOf("phone");
  const isPhoneEnabled = phoneIndex !== -1;
  const socialLogins: SocialAuthOption[] = authOptions.filter((o) =>
    socialAuthOptions.includes(o as SocialAuthOption),
  ) as SocialAuthOption[];

  const columnCount = useMemo(() => {
    switch (socialLogins.length) {
      case 7:
        return 4;
      case 6:
        return 4;
      default:
        return 5;
    }
  }, [socialLogins.length]);

  const socialLoginColumns: SocialAuthOption[][] = useMemo(() => {
    return Array.from(
      { length: Math.ceil(socialLogins.length / columnCount) },
      (_, i) => socialLogins.slice(i * columnCount, (i + 1) * columnCount),
    );
  }, [socialLogins, columnCount]);

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
  const guestEnabled = authOptions.includes("guest");
  const siweEnabled = authOptions.includes("wallet");

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

  const hasSocialLogins = socialLogins.length > 0;
  const ecosystemInfo = isEcosystemWallet(wallet)
    ? {
        id: wallet.id,
        partnerId: wallet.getConfig()?.partnerId,
      }
    : undefined;

  const handleGuestLogin = async () => {
    const connectOptions = {
      chain: props.chain,
      client: props.client,
      ecosystem: ecosystemInfo,
      strategy: "guest" as const,
    };
    const connectPromise = (async () => {
      const result = await wallet.connect(connectOptions);
      setLastAuthProvider("guest", webLocalStorage);
      return result;
    })();

    setData({
      guestLogin: {
        connectionPromise: connectPromise,
      },
    });

    props.select(); // show Connect UI
  };

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
        mode: authMode,
        redirectUrl: walletConfig?.auth?.redirectUrl,
      });
    }

    try {
      const socialLoginWindow = openOauthSignInWindow({
        authOption: strategy,
        client: props.client,
        ecosystem: ecosystemInfo,
        themeObj,
      });
      if (!socialLoginWindow) {
        throw new Error("Failed to open login window");
      }
      const connectOptions = {
        chain: props.chain,
        client: props.client,
        closeOpenedWindow: (openedWindow: Window) => {
          openedWindow.close();
        },
        ecosystem: ecosystemInfo,
        openedWindow: socialLoginWindow,
        strategy,
      };

      const connectPromise = (() => {
        if (props.isLinking) {
          if (wallet.id !== "inApp" && !isEcosystemWallet(wallet)) {
            throw new Error("Only in-app wallets support multi-auth");
          }
          return linkProfile(connectOptions);
        }

        const connectPromise = wallet.connect(connectOptions);
        setLastAuthProvider(strategy, webLocalStorage);
        return connectPromise;
      })();

      setData({
        socialLogin: {
          connectionPromise: connectPromise,
          type: strategy,
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
      walletLogin: {
        linking: props.isLinking || false,
      },
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
            alt={optionalImageMetadata.alt}
            client={props.client}
            height={`${optionalImageMetadata.height}`}
            src={optionalImageMetadata.src}
            style={{ margin: "auto" }}
            width={`${optionalImageMetadata.width}`}
          />
          <Spacer y="xxs" />
        </>
      )}
      {/* Social Login */}
      {hasSocialLogins && (
        <Container flex="column" gap={socialLogins.length > 4 ? "xs" : "sm"}>
          {socialLoginColumns.map((column) => (
            <SocialButtonRow key={column[0]}>
              {column.map((loginMethod) => {
                const imgIconSize = (() => {
                  if (!showOnlyIcons) {
                    return iconSize.md;
                  }
                  if (socialLogins.length > 4) {
                    return iconSize.md;
                  }
                  return iconSize.lg;
                })();
                return (
                  <SocialButton
                    aria-label={`Login with ${loginMethod}`}
                    data-variant={showOnlyIcons ? "icon" : "full"}
                    disabled={props.disabled}
                    key={loginMethod}
                    onClick={() => {
                      handleSocialLogin(loginMethod as SocialAuthOption);
                    }}
                    style={{
                      flexGrow: socialLogins.length < 7 ? 1 : 0,
                    }}
                    variant="outline"
                  >
                    <Img
                      client={props.client}
                      height={imgIconSize}
                      src={socialIcons[loginMethod as SocialAuthOption]}
                      width={imgIconSize}
                    />
                    {!showOnlyIcons &&
                      `${socialLogins.length === 1 ? "Continue with " : ""}${loginMethodsLabel[loginMethod as SocialAuthOption]}`}
                  </SocialButton>
                );
              })}
            </SocialButtonRow>
          ))}
        </Container>
      )}

      {props.size === "wide" &&
        hasSocialLogins &&
        (isEmailEnabled || isPhoneEnabled) && <TextDivider text={locale.or} />}

      {/* Email/Phone Login */}
      {isEmailEnabled &&
        (inputMode === "email" ? (
          <InputSelectionUI
            disabled={props.disabled}
            emptyErrorMessage={emptyErrorMessage}
            errorMessage={(input) => {
              const isValidEmail = validateEmail(input.toLowerCase());
              if (!isValidEmail) {
                return locale.invalidEmail;
              }
              return undefined;
            }}
            name="email"
            onSelect={(value) => {
              setData({ emailLogin: value });
              props.select();
            }}
            placeholder={placeholder}
            submitButtonText={locale.submitEmail}
            type={type}
          />
        ) : (
          <WalletTypeRowButton
            client={props.client}
            disabled={props.disabled}
            icon={EmailIcon}
            onClick={() => {
              setManualInputMode("email");
            }}
            title={locale.emailPlaceholder}
          />
        ))}
      {isPhoneEnabled &&
        (inputMode === "phone" ? (
          <InputSelectionUI
            allowedSmsCountryCodes={
              wallet.getConfig()?.auth?.allowedSmsCountryCodes
            }
            defaultSmsCountryCode={
              wallet.getConfig()?.auth?.defaultSmsCountryCode
            }
            disabled={props.disabled}
            emptyErrorMessage={emptyErrorMessage}
            errorMessage={(_input) => {
              // removes white spaces and special characters
              const input = _input.replace(/[-() ]/g, "");
              const isPhone = /^[0-9]+$/.test(input);

              if (!isPhone && isPhoneEnabled) {
                return locale.invalidPhone;
              }

              return undefined;
            }}
            format="phone"
            name="phone"
            onSelect={(value) => {
              // removes white spaces and special characters
              setData({ phoneLogin: value.replace(/[-() ]/g, "") });
              props.select();
            }}
            placeholder={placeholder}
            submitButtonText={locale.submitEmail}
            type={type}
          />
        ) : (
          <WalletTypeRowButton
            client={props.client}
            disabled={props.disabled}
            icon={PhoneIcon}
            onClick={() => {
              setManualInputMode("phone");
            }}
            title={locale.phonePlaceholder}
          />
        ))}

      {passKeyEnabled && (
        <WalletTypeRowButton
          client={props.client}
          disabled={props.disabled}
          icon={FingerPrintIcon}
          onClick={() => {
            handlePassKeyLogin();
          }}
          title={locale.passkey}
        />
      )}

      {/* SIWE login */}
      {siweEnabled && !props.isLinking && (
        <WalletTypeRowButton
          client={props.client}
          icon={OutlineWalletIcon}
          onClick={() => {
            handleWalletLogin();
          }}
          title={locale.signInWithWallet}
        />
      )}

      {/* Guest login */}
      {guestEnabled && (
        <WalletTypeRowButton
          client={props.client}
          disabled={props.disabled}
          icon={GuestIcon}
          onClick={() => {
            handleGuestLogin();
          }}
          title={locale.loginAsGuest}
        />
      )}

      {props.isLinking && (
        <WalletTypeRowButton
          client={props.client}
          icon={OutlineWalletIcon}
          onClick={() => {
            handleWalletLogin();
          }}
          title={locale.linkWallet}
        />
      )}
    </Container>
  );
};

const SocialButtonRow = (props: { children: React.ReactNode[] }) => (
  <Container
    center="x"
    flex="row"
    gap={props.children.length > 4 ? "xs" : "sm"}
    style={{
      display: "flex",
      justifyContent: "center",
      ...{
        "& > *": {
          flexBasis: `${100 / props.children.length}%`,
          maxWidth: `${100 / props.children.length}%`,
        },
      },
    }}
  >
    {props.children}
  </Container>
);

const SocialButton = /* @__PURE__ */ styled(Button)({
  "&[data-variant='full']": {
    "&:active": {
      boxShadow: "none",
    },
    display: "flex",
    fontSize: fontSize.md,
    fontWeight: 500,
    gap: spacing.sm,
    justifyContent: "flex-start",
    padding: spacing.md,
    transition: "background-color 0.2s ease",
  },
  "&[data-variant='icon']": {
    padding: spacing.sm,
  },
});
