import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import {
  ConnectUIProps,
  WalletOptions,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import type { ConfiguredMagicLinkWallet } from "./types";
import { useRef, useEffect, useCallback } from "react";
import { Spinner } from "../../../components/Spinner";
import { Container, ModalHeader } from "../../../components/basic";
import { InputSelectionUI } from "../InputSelectionUI";
import { Img } from "../../../components/Img";
import { fontSize, iconSize, spacing } from "../../../design-system";
import { Button, IconButton } from "../../../components/buttons";
import { ToolTip } from "../../../components/Tooltip";
import styled from "@emotion/styled";
import {
  emailAndPhoneIcon,
  emailIcon,
  phoneIcon,
} from "../../ConnectWallet/icons/dataUris";
import { TextDivider } from "../../../components/TextDivider";
import { useScreenContext } from "../../ConnectWallet/Modal/screen";
import { reservedScreens } from "../../ConnectWallet/constants";
import { Spacer } from "../../../components/Spacer";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import {
  appleIconUri,
  bitbucketIconUri,
  discordIconUri,
  facebookIconUri,
  githubIconUri,
  gitlabIconUri,
  googleIconUri,
  linkedinIconUri,
  microsoftIconUri,
  twitchIconUri,
  twitterIconUri,
} from "../../ConnectWallet/icons/socialLogins";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";

/**
 * @wallet
 */
export type MagicWalletConfigOptions = MagicLinkAdditionalOptions & {
  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

/**
 * A wallet configurator for [Magic Link](https://magic.link/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * magicLink({
 *   apiKey: "pk_test_123",
 *   emailLogin: true,
 *   smsLogin: true,
 *   oauthOptions: {
 *     providers: ["google", "facebook"],
 *     redirectURI: "https://example.com/foo/bar",
 *   },
 *   type: "auth", // or 'connect'
 * });
 * ```
 *
 * @param config -
 * Object containing the following properties to configure the wallet
 *
 * ### apiKey
 * Your Magic Link apiKey
 *
 * You can get an API key by signing up for an account on [Magic Link's website](https://magic.link/).
 *
 * Must be a `string`
 *
 * ### magicSdkConfiguration (optional)
 * Configuration for [Magic Auth](https://magic.link/docs/auth/overview) SDK
 *
 * This is only relevant if you are using `type: 'auth'` in your config
 *
 * ```ts
 * {
 *   locale?: string;
 *   endpoint?: string;
 *   testMode?: boolean;
 * }
 * ```
 *
 * * `locale` - Customize the language of Magic's modal, email and confirmation screen. See [Localization](https://magic.link/docs/auth/more/customization/localization) for more.
 *
 * * `endpoint` - A URL pointing to the Magic iframe application
 *
 * * `testMode` - Enable [testMode](https://magic.link/docs/auth/introduction/test-mode) to assert the desired behavior through the email address you provide to `loginWithMagicLink` without having to go through the auth flow.
 *
 * ### smsLogin (optional)
 * Specify whether you want to allow users to login with their phone number or not. It is `true` by default
 *
 * This is only relevant if you are using `type: 'auth'`
 *
 * Must be a `boolean`
 *
 * ### emailLogin (optional)
 * Specify whether you want to allow users to login with their email or not. It is `true` by default
 *
 * This is only relevant if you are using `type: 'auth'`
 *
 * Must be a `boolean`
 *
 * ### oauthOptions (optional)
 * Specify which oauth providers you support in `providers` array.
 *
 * Specify which URI to redirect to after the oauth flow is complete in `redirectURI` option. If no `redirectURI` is specified, the user will be redirected to the current page.
 *
 * You must pass full URL and not just a relative path. For example, `"https://example.com/foo"` is valid but `"/foo"` is not.
 * You can use `new URL("/foo", window.location.origin).href` to get the full URL from a relative path based on the current origin.
 *
 * This is only relevant if you are using `type: 'auth'`
 *
 * You also need to enable the oauth providers for your apiKey from [Magic dashboard](https://dashboard.magic.link/).
 *
 * ```ts
 * type OauthOptions = {
 *   redirectURI?: string;
 *   providers: OauthProvider[];
 * };
 *
 * type OauthProvider =
 *   | "google"
 *   | "facebook"
 *   | "apple"
 *   | "github"
 *   | "bitbucket"
 *   | "gitlab"
 *   | "linkedin"
 *   | "twitter"
 *   | "discord"
 *   | "twitch"
 *   | "microsoft";
 * ```
 *
 * ### recommended (optional)
 * Show this wallet as "recommended" in the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export function magicLink(
  config: MagicWalletConfigOptions,
): ConfiguredMagicLinkWallet {
  const emailLoginEnabled = config.emailLogin !== false;
  const smsLoginEnabled = config.smsLogin !== false;
  const oauthProviders = config.oauthOptions?.providers;

  const type = config.type || "auth";

  let icon = emailAndPhoneIcon;
  let iconText = "Email or phone";

  if (emailLoginEnabled && !smsLoginEnabled) {
    icon = emailIcon;
    iconText = "Email";
  }

  if (!emailLoginEnabled && smsLoginEnabled) {
    icon = phoneIcon;
    iconText = "Phone number";
  }

  if (!emailLoginEnabled && !smsLoginEnabled) {
    iconText = "Social login";
  }

  return {
    id: MagicLink.id,
    recommended: config?.recommended,
    isHeadless: true,
    meta: {
      ...MagicLink.meta,
      name: iconText,
      iconURL: icon,
    },
    create: (options: WalletOptions) =>
      new MagicLink({ ...options, ...config }),
    connectUI(props) {
      if (props.modalSize === "wide") {
        return (
          <MagicConnectionUIScreen
            {...props}
            type={type}
            emailLogin={emailLoginEnabled}
            smsLogin={smsLoginEnabled}
            oauthProviders={oauthProviders}
          />
        );
      }

      if (props.selectionData === undefined) {
        return (
          <MagicConnectionUIScreen
            {...props}
            type={type}
            emailLogin={emailLoginEnabled}
            smsLogin={smsLoginEnabled}
            oauthProviders={oauthProviders}
          />
        );
      }

      return <MagicConnectingUI {...props} type={type} />;
    },
    isInstalled() {
      return false;
    },
  };
}

type OauthProvider = Exclude<
  MagicLinkAdditionalOptions["oauthOptions"],
  undefined
>["providers"][number];

type SelectionData = string | { provider: OauthProvider };

const MagicUI: React.FC<{
  onSelect: (selection: string | { provider: OauthProvider }) => void;
  emailLogin: boolean;
  smsLogin: boolean;
  oauthProviders?: OauthProvider[];
  modalSize: "compact" | "wide";
}> = (props) => {
  const cwLocale = useTWLocale().connectWallet;
  const locale = useTWLocale().wallets.magicLink;
  const isEmailEnabled = props.emailLogin !== false;
  const isSMSEnabled = props.smsLogin !== false;

  let placeholder = locale.loginWithEmailOrPhone;
  let type = "text";
  let emptyErrorMessage = locale.emailOrPhoneRequired;
  if (isEmailEnabled && !isSMSEnabled) {
    placeholder = locale.emailPlaceholder;
    emptyErrorMessage = locale.emailRequired;
    type = "email";
  } else if (!isEmailEnabled && isSMSEnabled) {
    placeholder = locale.loginWithPhone;
    emptyErrorMessage = locale.phoneRequired;
    type = "tel";
  }

  if (!isEmailEnabled && !isSMSEnabled && !props.oauthProviders) {
    throw new Error(
      'MagicLink must have either "emailLogin" or "smsLogin" or social login enabled',
    );
  }

  const showInputUI = isEmailEnabled || isSMSEnabled;
  const { screen } = useScreenContext();
  const showSeparator =
    props.modalSize === "wide" ||
    (screen !== reservedScreens.main && props.modalSize === "compact");

  return (
    <Container
      flex="column"
      animate="fadein"
      gap={props.modalSize === "compact" ? "lg" : "xl"}
      style={{
        width: "100%",
      }}
    >
      {props.oauthProviders && (
        <>
          {props.oauthProviders.length > 1 ? (
            <Container
              gap="md"
              flex="row"
              style={{
                justifyContent: "space-between",
              }}
              center="x"
            >
              {props.oauthProviders.map((provider) => {
                return (
                  <SocialIconButton
                    key={provider}
                    onClick={() => {
                      props.onSelect({ provider });
                    }}
                  >
                    <ToolTip
                      tip={`${locale.loginWith} ${upperCaseFirstLetter(
                        provider,
                      )}`}
                      sideOffset={15}
                    >
                      <Container flex="row" center="both">
                        <Img
                          src={providerImages[provider]}
                          width={iconSize.lg}
                          height={iconSize.lg}
                          alt=""
                        />
                      </Container>
                    </ToolTip>
                  </SocialIconButton>
                );
              })}
            </Container>
          ) : (
            <Container gap="xs" flex="column">
              {props.oauthProviders.map((provider) => {
                return (
                  <SocialButtonLarge
                    key={provider}
                    variant="secondary"
                    onClick={() => {
                      props.onSelect({ provider });
                    }}
                  >
                    <Img
                      src={providerImages[provider]}
                      width={iconSize.md}
                      height={iconSize.md}
                      alt=""
                    />
                    <span>
                      {locale.loginWith} {upperCaseFirstLetter(provider)}
                    </span>
                  </SocialButtonLarge>
                );
              })}
            </Container>
          )}
        </>
      )}

      {showInputUI && (
        <>
          {showSeparator && <TextDivider text={cwLocale.or} />}
          <InputSelectionUI
            submitButtonText={locale.submitEmail}
            onSelect={props.onSelect}
            placeholder={placeholder}
            name="magic-input"
            type={type}
            emptyErrorMessage={emptyErrorMessage}
            errorMessage={(_input) => {
              const input = _input.toLowerCase();
              const isEmail = input.includes("@");
              const isPhone = Number.isInteger(Number(input[input.length - 1]));

              if (isEmail && isEmailEnabled) {
                const emailRegex =
                  /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
                const isValidEmail = emailRegex.test(input.replace(/\+/g, ""));
                if (!isValidEmail) {
                  return locale.invalidEmail;
                }
              } else if (isPhone && isSMSEnabled) {
                if (!input.startsWith("+")) {
                  return locale.countryCodeMissing;
                }
              } else {
                if (isEmailEnabled && isSMSEnabled) {
                  return locale.invalidEmailOrPhone;
                }
                if (isEmailEnabled) {
                  return locale.invalidEmail;
                }
                if (isSMSEnabled) {
                  return locale.invalidPhone;
                }
              }
            }}
          />
        </>
      )}
    </Container>
  );
};

function useConnectMagic() {
  const { activeChain } = useWalletContext();

  const connector = useCallback(
    async (data: {
      selectionData: SelectionData;
      connect: ConnectUIProps<MagicLink>["connect"];
      singleWallet: boolean;
      type: "auth" | "connect";
      show: () => void;
      connected: () => void;
      hide: () => void;
    }) => {
      const { selectionData, connected, show, hide, connect } = data;

      // oauth
      if (typeof selectionData === "object") {
        try {
          hide();
          (async () => {
            await connect({
              oauthProvider: selectionData.provider,
              chainId: activeChain.chainId,
            });
          })();
          connected();
        } catch (e) {
          console.error(e);
        }

        show();
      }

      // email or phone
      else {
        const isEmail = selectionData
          ? (selectionData as string).includes("@")
          : false;

        hide();
        try {
          await connect(
            data.type === "connect"
              ? {}
              : isEmail
                ? { email: selectionData, chainId: activeChain.chainId }
                : { phoneNumber: selectionData, chainId: activeChain.chainId },
          );
          connected();
        } catch (e) {
          console.error(e);
        }
        show();
      }
    },
    [activeChain.chainId],
  );

  return connector;
}

const MagicConnectingUI: React.FC<
  ConnectUIProps<MagicLink> & { type: "auth" | "connect" }
> = ({
  connected,
  walletConfig,
  show,
  selectionData,
  supportedWallets,
  type,
  hide,
  connect,
}) => {
  const connectPrompted = useRef(false);
  const singleWallet = supportedWallets.length === 1;
  const connectMagic = useConnectMagic();

  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }
    connectPrompted.current = true;

    connectMagic({
      selectionData: selectionData as SelectionData,
      singleWallet,
      type,
      connect,
      show,
      connected,
      hide,
    });
  }, [
    connectMagic,
    connected,
    selectionData,
    show,
    singleWallet,
    type,
    walletConfig,
    hide,
    connect,
  ]);

  return (
    <Container
      flex="row"
      center="both"
      style={{
        minHeight: "350px",
      }}
    >
      <Spinner size="xl" color="accentText" />
    </Container>
  );
};

const MagicConnectionUIScreen: React.FC<
  ConnectUIProps<MagicLink> & {
    type: "auth" | "connect";
    emailLogin: boolean;
    smsLogin: boolean;
    oauthProviders?: OauthProvider[];
  }
> = (props) => {
  const locale = useTWLocale().wallets.magicLink;
  const connectMagic = useConnectMagic();

  return (
    <Container
      p="lg"
      fullHeight
      flex="column"
      style={{
        minHeight: "300px",
      }}
    >
      <ModalHeader onBack={props.goBack} title={locale.signIn} />
      <Spacer y="xl" />
      <Container
        expand
        flex="column"
        center="both"
        px={props.modalSize === "wide" ? "lg" : undefined}
      >
        <MagicUI
          {...props}
          onSelect={(data) => {
            connectMagic({
              selectionData: data,
              connected: props.connected,
              show: props.show,
              singleWallet: props.supportedWallets.length === 1,
              type: props.type,
              connect: props.connect,
              hide: props.hide,
            });
          }}
        />
      </Container>
    </Container>
  );
};

const providerImages: Record<OauthProvider, string> = {
  google: googleIconUri,
  facebook: facebookIconUri,
  twitter: twitterIconUri,
  github: githubIconUri,
  apple: appleIconUri,
  linkedin: linkedinIconUri,
  bitbucket: bitbucketIconUri,
  gitlab: gitlabIconUri,
  twitch: twitchIconUri,
  discord: discordIconUri,
  microsoft: microsoftIconUri,
};

function upperCaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const SocialButtonLarge = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    display: "flex",
    justifyContent: "center",
    gap: spacing.md,
    fontSize: fontSize.md,
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: theme.colors.secondaryButtonBg,
    },
    "&:active": {
      boxShadow: "none",
    },
  };
});

const SocialIconButton = /* @__PURE__ */ styled(IconButton)(() => {
  const theme = useCustomTheme();
  return {
    border: `1px solid ${theme.colors.borderColor}`,
    padding: spacing.sm,
    transition: "border-color 0.2s ease",
    "&:hover": {
      borderColor: theme.colors.accentText,
      background: "transparent",
    },
    flexGrow: 1,
  };
});
