"use client";
import { useEffect, useMemo } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getDefaultWallets } from "../../../../../wallets/defaultWallets.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../../core/design-system/index.js";
import {
  type SiweAuthOptions,
  useSiweAuth,
} from "../../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectEmbedProps } from "../../../../core/hooks/connection/ConnectEmbedProps.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useIsAutoConnecting } from "../../../../core/hooks/wallets/useIsAutoConnecting.js";
import { useConnectionManager } from "../../../../core/providers/connection-manager.js";
import { WalletUIStatesProvider } from "../../../providers/wallet-ui-states-provider.js";
import { canFitWideModal } from "../../../utils/canFitWideModal.js";
import { usePreloadWalletProviders } from "../../../utils/usePreloadWalletProviders.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { AutoConnect } from "../../AutoConnect/AutoConnect.js";
import { DynamicHeight } from "../../components/DynamicHeight.js";
import { StyledDiv } from "../../design-system/elements.js";
import type { LocaleId } from "../../types.js";
import {
  modalMaxWidthCompact,
  modalMaxWidthWide,
  reservedScreens,
  wideModalMaxHeight,
} from "../constants.js";
import { useConnectLocale } from "../locale/getConnectLocale.js";
import type { ConnectLocale } from "../locale/types.js";
import type { WelcomeScreen } from "../screens/types.js";
import { ConnectModalContent } from "./ConnectModalContent.js";
import { useSetupScreen } from "./screen.js";

/**
 * An inline wallet connection component that allows to:
 *
 * - Connect to 500+ external wallets
 * - Connect with email, phone, passkey or socials
 * - Convert any wallet to a ERC4337 smart wallet for gasless transactions
 * - Sign in with ethereum (Auth)
 *
 * It renders the same UI as the [`ConnectButton`](https://portal.thirdweb.com/react/v5/ConnectButton) component's modal - but directly inline in the page instead of being in a modal.
 *
 * Once connected, the component does not render any UI. It only renders UI if wallet is not connected.
 *
 * @example
 *
 * ## Default setup
 *
 * ```tsx
 * import { createThirdwebClient } from "thirdweb";
 * import { ConnectEmbed } from "thirdweb/react";
 *
 * const client = createThirdwebClient({ clientId: "YOUR_CLIENT_ID" });
 *
 * <ConnectEmbed
 *    client={client}
 * />
 * ```
 *
 * [View all available config options](https://portal.thirdweb.com/references/typescript/v5/ConnectEmbedProps)
 *
 *  ## Customization options
 *
 * ### Customizing wallet options
 *
 * ```tsx
 * <ConnectEmbed
 *    client={client}
 *    wallets={[
 *      createWallet("io.metamask"),
 *      createWallet("com.coinbase.wallet"),
 *      createWallet("me.rainbow"),
 *    ]}
 * />
 * ```
 *
 * [View all available wallets](https://portal.thirdweb.com/typescript/v5/supported-wallets)
 *
 *  ### Customizing the default chain to connect to
 *
 * ```tsx
 * import { base } from "thirdweb/chains";
 *
 * <ConnectEmbed
 *   client={client}
 *   chain={base}
 * />
 * ```
 *
 * ### Enabling Account Abstraction
 *
 * By passing the `accountAbstraction` prop, ALL connected wallets will be converted to smart accounts.
 * And by setting `sponsorGas` to `true`, all transactions done with those smart accounts will be sponsored.
 *
 * ```tsx
 * <ConnectEmbed
 * client={client}
 * accountAbstraction={{
 *   chain: sepolia,
 *   sponsorGas: true,
 * }}
 * />;
 * ```
 * Note that this prop doesn't affect ecosystem wallets. Ecosystem wallets will only be converted to smart accounts if the ecosystem owner has enabled account abstraction.
 *
 * ### Enabling sign in with ethereum (Auth)
 *
 * ```tsx
 * <ConnectEmbed
 * client={client}
 * auth={{
 *   isLoggedIn: async (address) => {
 *     console.log("checking if logged in!", { address });
 *     return await isLoggedIn();
 *   },
 *   doLogin: async (params) => {
 *     console.log("logging in!");
 *     await login(params);
 *   },
 *   getLoginPayload: async ({ address }) =>
 *     generatePayload({ address }),
 *   doLogout: async () => {
 *     console.log("logging out!");
 *     await logout();
 *   },
 * }}
 * />;
 * ```
 *
 * ### Customizing the theme
 *
 * ```tsx
 * <ConnectEmbed
 *    client={client}
 *    theme="light"
 * />
 * ```
 *
 * For more granular control, you can also pass a custom theme object:
 *
 * ```tsx
 * <ConnectEmbed
 *    client={client}
 *    theme={lightTheme({
 *      colors: {
 *        modalBg: "red",
 *      },
 *    })}
 * />
 * ```
 *
 * [View all available themes properties](https://portal.thirdweb.com/references/typescript/v5/Theme)
 *
 * ### Changing the display language
 *
 * ```tsx
 * <ConnectEmbed
 *    client={client}
 *    locale="ja_JP"
 * />
 * ```
 *
 * [View all available locales](https://portal.thirdweb.com/references/typescript/v5/LocaleId)
 *
 * @param props -
 * The props for the `ConnectEmbed` component.
 *
 * Refer to the [`ConnectEmbedProps`](https://portal.thirdweb.com/references/typescript/v5/ConnectEmbedProps) type for more details
 *
 * @returns A JSX element that renders the <ConnectEmbed> component.
 * @component
 * @walletConnection
 */
export function ConnectEmbed(props: ConnectEmbedProps) {
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const siweAuth = useSiweAuth(activeWallet, activeAccount, props.auth);
  const show =
    !activeAccount || (siweAuth.requiresAuth && !siweAuth.isLoggedIn);
  const connectionManager = useConnectionManager();

  // Add props.chain and props.chains to defined chains store
  useEffect(() => {
    if (props.chain) {
      connectionManager.defineChains([props.chain]);
    }
  }, [props.chain, connectionManager]);

  useEffect(() => {
    if (props.chains) {
      connectionManager.defineChains(props.chains);
    }
  }, [props.chains, connectionManager]);

  const wallets = useMemo(
    () =>
      props.wallets ||
      getDefaultWallets({
        appMetadata: props.appMetadata,
        chains: props.chains,
      }),
    [props.wallets, props.appMetadata, props.chains],
  );
  const localeId = props.locale || "en_US";
  const localeQuery = useConnectLocale(localeId);

  usePreloadWalletProviders({
    wallets,
  });

  const modalSize = useMemo(() => {
    return !canFitWideModal() || wallets.length === 1
      ? "compact"
      : props.modalSize || ("compact" as const);
  }, [wallets.length, props.modalSize]);

  const meta = useMemo(() => {
    return {
      privacyPolicyUrl: props.privacyPolicyUrl,
      requireApproval: props.requireApproval,
      showThirdwebBranding: props.showThirdwebBranding !== false,
      termsOfServiceUrl: props.termsOfServiceUrl,
      title: undefined,
      titleIconUrl: undefined,
    };
  }, [
    props.privacyPolicyUrl,
    props.showThirdwebBranding,
    props.termsOfServiceUrl,
    props.requireApproval,
  ]);

  const preferredChain =
    props.accountAbstraction?.chain || props.chain || props.chains?.[0];

  const autoConnectComp = props.autoConnect !== false && (
    <AutoConnect
      accountAbstraction={props.accountAbstraction}
      appMetadata={props.appMetadata}
      chain={preferredChain}
      client={props.client}
      onConnect={props.onConnect}
      siweAuth={siweAuth}
      timeout={
        typeof props.autoConnect === "boolean"
          ? undefined
          : props.autoConnect?.timeout
      }
      wallets={wallets}
    />
  );

  if (show) {
    if (!localeQuery.data) {
      return (
        <>
          {autoConnectComp}
          <CustomThemeProvider theme={props.theme}>
            <EmbedContainer modalSize={modalSize}>
              <LoadingScreen />
            </EmbedContainer>
          </CustomThemeProvider>
        </>
      );
    }

    return (
      <WalletUIStatesProvider isOpen={true} theme={props.theme}>
        <ConnectEmbedContent
          accountAbstraction={props.accountAbstraction}
          auth={props.auth}
          chain={preferredChain}
          chains={props.chains}
          className={props.className}
          client={props.client}
          connectLocale={localeQuery.data}
          header={props.header}
          hiddenWallets={props.hiddenWallets}
          localeId={props.locale || "en_US"}
          meta={meta}
          modalSize={modalSize}
          onConnect={props.onConnect}
          recommendedWallets={props.recommendedWallets}
          showAllWallets={props.showAllWallets}
          size={modalSize}
          style={props.style}
          walletConnect={props.walletConnect}
          wallets={wallets}
          welcomeScreen={props.welcomeScreen}
        />
        {autoConnectComp}
      </WalletUIStatesProvider>
    );
  }

  return <div>{autoConnectComp}</div>;
}

/**
 * @internal
 */
const ConnectEmbedContent = (props: {
  modalSize?: "compact" | "wide";
  className?: string;
  style?: React.CSSProperties;
  // ---
  accountAbstraction: SmartWalletOptions | undefined;
  auth: SiweAuthOptions | undefined;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
  size: "compact" | "wide";
  header:
    | {
        title?: string;
        titleIcon?: string;
      }
    | true
    | undefined;
  localeId: LocaleId;
  onConnect: ((wallet: Wallet) => void) | undefined;
  recommendedWallets: Wallet[] | undefined;
  showAllWallets: boolean | undefined;
  hiddenWallets: WalletId[] | undefined;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
  wallets: Wallet[];
  welcomeScreen: WelcomeScreen | undefined;
}) => {
  // const requiresSignIn = false;
  const screenSetup = useSetupScreen({
    size: props.size,
    wallets: props.wallets,
    welcomeScreen: undefined,
  });
  const { setScreen, initialScreen, screen } = screenSetup;
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const siweAuth = useSiweAuth(activeWallet, activeAccount, props.auth);

  const isAutoConnecting = useIsAutoConnecting();

  let content = null;

  // if sign in is required but connect embed is showing the initial screen - change to sign in screen
  useEffect(() => {
    if (
      siweAuth.requiresAuth &&
      !siweAuth.isLoggedIn &&
      activeAccount &&
      screen === initialScreen
    ) {
      setScreen(reservedScreens.signIn);
    }
  }, [siweAuth, setScreen, activeAccount, screen, initialScreen]);

  const modalSize = !canFitWideModal()
    ? "compact"
    : props.modalSize || ("compact" as const);

  // show spinner on page load and during auto connecting a wallet
  if (isAutoConnecting) {
    content = <LoadingScreen />;
  } else {
    content = (
      <ConnectModalContent
        accountAbstraction={props.accountAbstraction}
        auth={props.auth}
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        connectLocale={props.connectLocale}
        hideHeader={!props.header}
        isOpen={true}
        meta={{
          ...props.meta,
          title:
            typeof props.header === "object" ? props.header.title : undefined,
          titleIconUrl:
            typeof props.header === "object"
              ? props.header.titleIcon
              : undefined,
        }}
        modalHeader={undefined}
        onClose={() => {
          setScreen(initialScreen);
        }}
        onConnect={props.onConnect}
        recommendedWallets={props.recommendedWallets}
        screenSetup={screenSetup}
        setModalVisibility={() => {
          // no op
        }}
        shouldSetActive={true}
        showAllWallets={props.showAllWallets}
        size={props.size}
        walletConnect={props.walletConnect}
        walletIdsToHide={props.hiddenWallets}
        wallets={props.wallets}
        welcomeScreen={props.welcomeScreen}
      />
    );
  }

  return (
    <EmbedContainer
      className={props.className}
      modalSize={modalSize}
      style={props.style}
    >
      {modalSize === "wide" ? (
        content
      ) : (
        <DynamicHeight> {content} </DynamicHeight>
      )}
    </EmbedContainer>
  );
};

export const EmbedContainer = /* @__PURE__ */ StyledDiv<{
  modalSize: "compact" | "wide";
}>((props) => {
  const { modalSize } = props;
  const theme = useCustomTheme();
  return {
    "& *": {
      boxSizing: "border-box",
    },
    "& *::selection": {
      backgroundColor: theme.colors.selectedTextBg,
      color: theme.colors.selectedTextColor,
    },
    background: theme.colors.modalBg,
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.xl,
    boxSizing: "border-box",
    color: theme.colors.primaryText,
    fontFamily: theme.fontFamily,
    height: modalSize === "compact" ? "auto" : wideModalMaxHeight,
    lineHeight: "normal",
    overflow: "hidden",
    position: "relative",
    width: modalSize === "compact" ? modalMaxWidthCompact : modalMaxWidthWide,
  };
});
