import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import {
  ConnectUIProps,
  SelectUIProps,
  WalletConfig,
  WalletOptions,
  useConnect,
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
import { WalletEntryButton } from "../../ConnectWallet/WalletSelector";
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

export type MagicWalletConfigOptions = MagicLinkAdditionalOptions & {
  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

/**
 * A wallet configurator for [Magic Link](https://magic.link/) which allows integrating the wallet with React.
 *
 * It returns a `WalletConfig` object which can be used to connect the wallet to app via `ConnectWallet` component or `useConnect` hook.
 *
 * @example
 *
 * ### Usage with ConnectWallet
 *
 * To allow users to connect to this wallet using the `ConnectWallet` component, you can add it to `ThirdwebProvider`'s supportedWallets prop.
 *
 * ```tsx
 * <ThirdwebProvider supportedWallets={[magicLink({
 *   apiKey: "MAGIC_API_KEY,
 * })]}>
 *  <App />
 * </ThirdwebProvider>
 * ```
 *
 * ### Usage with useConnect
 *
 * you can use the `useConnect` hook to programmatically connect to the wallet without using the `ConnectWallet` component.
 *
 * The wallet also needs to be added in `ThirdwebProvider`'s supportedWallets if you want the wallet to auto-connect on next page load.
 *
 * ```tsx
 * const magicLinkConfig = magicLink({
 *   apiKey: "MAGIC_API_KEY,
 * });
 *
 * function App() {
 *   const connect = useConnect();
 *
 *   async function handleConnect() {
 *     const wallet = await connect(magicLinkConfig, options);
 *     console.log('connected to', wallet);
 *   }
 *
 *   return <button onClick={handleConnect}> Connect </button>;
 * }
 * ```
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
    category: "socialLogin",
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
    // select UI only for auth
    selectUI:
      config.type === "connect"
        ? undefined
        : (props) => {
            return (
              <MagicSelectUI
                {...props}
                emailLoginEnabled={emailLoginEnabled}
                smsLoginEnabled={smsLoginEnabled}
                oauthProviders={oauthProviders}
              />
            );
          },
    isInstalled() {
      return false;
    },
  };
}

const MagicSelectUI = (
  props: SelectUIProps<MagicLink> & {
    emailLoginEnabled: boolean;
    smsLoginEnabled: boolean;
    oauthProviders?: OauthProvider[];
  },
) => {
  const screen = useScreenContext();

  if (
    props.modalSize === "wide" ||
    (screen !== reservedScreens.main && props.modalSize === "compact")
  ) {
    return (
      <WalletEntryButton
        walletConfig={props.walletConfig}
        selectWallet={() => props.onSelect(undefined)}
      />
    );
  }

  return (
    <MagicUI
      {...props}
      emailLogin={props.emailLoginEnabled}
      smsLogin={props.smsLoginEnabled}
      oauthProviders={props.oauthProviders}
    />
  );
};

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
  const screen = useScreenContext();
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
            errorMessage={(input) => {
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
  const connect = useConnect();
  const { activeChain } = useWalletContext();

  const connector = useCallback(
    async (data: {
      selectionData: SelectionData;
      walletConfig: WalletConfig<MagicLink>;
      singleWallet: boolean;
      type: "auth" | "connect";
      show: () => void;
      connected: () => void;
      hide: () => void;
    }) => {
      const { selectionData, walletConfig, connected, show, hide } = data;

      // oauth
      if (typeof selectionData === "object") {
        try {
          hide();
          (async () => {
            await connect(walletConfig, {
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
            walletConfig,
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
    [connect, activeChain.chainId],
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
      walletConfig,
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
              walletConfig: props.walletConfig,
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
