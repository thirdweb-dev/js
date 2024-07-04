"use client";
import { useEffect, useMemo } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
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
import { useActiveAccount } from "../../../hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../hooks/wallets/useActiveWallet.js";
import { useIsAutoConnecting } from "../../../hooks/wallets/useIsAutoConnecting.js";
import { WalletUIStatesProvider } from "../../../providers/wallet-ui-states-provider.js";
import { canFitWideModal } from "../../../utils/canFitWideModal.js";
import { usePreloadWalletProviders } from "../../../utils/usePreloadWalletProviders.js";
import { getDefaultWallets } from "../../../wallets/defaultWallets.js";
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
import { ConnectModalContent } from "./ConnectModalContent.js";
import { useSetupScreen } from "./screen.js";

/**
 * A component that allows the user to connect their wallet.
 *
 * it renders the same UI as the [`ConnectButton`](https://portal.thirdweb.com/react/v4/components/ConnectButton) component's modal - but directly on the page instead of being in a modal.
 *
 * It only renders UI if wallet is not connected
 * @example
 * ```tsx
 * <ConnectEmbed
 *    client={client}
 * />
 * ```
 * @param props -
 * The props for the `ConnectEmbed` component.
 *
 * Refer to the [`ConnectEmbedProps`](https://portal.thirdweb.com/references/typescript/v5/ConnectEmbedProps) type for more details
 * @component
 */
export function ConnectEmbed(props: ConnectEmbedProps) {
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const siweAuth = useSiweAuth(activeWallet, props.auth);
  const show =
    !activeAccount || (siweAuth.requiresAuth && !siweAuth.isLoggedIn);

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
    client: props.client,
  });

  const modalSize = useMemo(() => {
    return !canFitWideModal() || wallets.length === 1
      ? "compact"
      : props.modalSize || ("compact" as const);
  }, [wallets.length, props.modalSize]);

  const meta = useMemo(() => {
    return {
      privacyPolicyUrl: props.privacyPolicyUrl,
      showThirdwebBranding: props.showThirdwebBranding !== false,
      termsOfServiceUrl: props.termsOfServiceUrl,
      title: undefined,
      titleIconUrl: undefined,
    };
  }, [
    props.privacyPolicyUrl,
    props.showThirdwebBranding,
    props.termsOfServiceUrl,
  ]);

  const autoConnectComp = props.autoConnect !== false && (
    <AutoConnect
      appMetadata={props.appMetadata}
      client={props.client}
      wallets={wallets}
      accountAbstraction={props.accountAbstraction}
      timeout={
        typeof props.autoConnect === "boolean"
          ? undefined
          : props.autoConnect?.timeout
      }
      onConnect={props.onConnect}
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
      <WalletUIStatesProvider theme={props.theme} isOpen={true}>
        <ConnectEmbedContent
          auth={props.auth}
          accountAbstraction={props.accountAbstraction}
          chain={props.chain || props.accountAbstraction?.chain}
          chains={props.chains}
          client={props.client}
          connectLocale={localeQuery.data}
          size={modalSize}
          // TODO: no welcome screen for embed right now?
          // welcomeScreen={undefined}
          meta={meta}
          isEmbed={true}
          localeId={props.locale || "en_US"}
          onConnect={props.onConnect}
          recommendedWallets={props.recommendedWallets}
          showAllWallets={props.showAllWallets}
          walletConnect={props.walletConnect}
          wallets={wallets}
          className={props.className}
          modalSize={modalSize}
          style={props.style}
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
  isEmbed: boolean;
  localeId: LocaleId;
  onConnect: ((wallet: Wallet) => void) | undefined;
  recommendedWallets: Wallet[] | undefined;
  showAllWallets: boolean | undefined;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
  wallets: Wallet[];
}) => {
  // const requiresSignIn = false;
  const screenSetup = useSetupScreen({
    size: props.size,
    welcomeScreen: undefined,
    wallets: props.wallets,
  });
  const { setScreen, initialScreen } = screenSetup;
  const activeWallet = useActiveWallet();
  const siweAuth = useSiweAuth(activeWallet, props.auth);
  const activeAccount = useActiveAccount();

  const isAutoConnecting = useIsAutoConnecting();

  let content = null;

  useEffect(() => {
    if (siweAuth.requiresAuth && !siweAuth.isLoggedIn && activeAccount) {
      setScreen(reservedScreens.signIn);
    }
  }, [siweAuth, setScreen, activeAccount]);

  const modalSize = !canFitWideModal()
    ? "compact"
    : props.modalSize || ("compact" as const);

  // show spinner on page load and during auto connecting a wallet
  if (isAutoConnecting) {
    content = <LoadingScreen />;
  } else {
    content = (
      <ConnectModalContent
        shouldSetActive={true}
        screenSetup={screenSetup}
        isOpen={true}
        onClose={() => {
          setScreen(initialScreen);
        }}
        setModalVisibility={() => {
          // no op
        }}
        accountAbstraction={props.accountAbstraction}
        auth={props.auth}
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        connectLocale={props.connectLocale}
        meta={props.meta}
        size={props.size}
        // TODO: no welcome screen for embed right now?
        // welcomeScreen={undefined}
        welcomeScreen={undefined}
        isEmbed={props.isEmbed}
        onConnect={props.onConnect}
        recommendedWallets={props.recommendedWallets}
        showAllWallets={props.showAllWallets}
        walletConnect={props.walletConnect}
        wallets={props.wallets}
        modalHeader={undefined}
        walletIdsToHide={undefined}
      />
    );
  }

  return (
    <EmbedContainer
      modalSize={modalSize}
      className={props.className}
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
    color: theme.colors.primaryText,
    background: theme.colors.modalBg,
    height: modalSize === "compact" ? "auto" : wideModalMaxHeight,
    width: modalSize === "compact" ? modalMaxWidthCompact : modalMaxWidthWide,
    boxSizing: "border-box",
    position: "relative",
    lineHeight: "normal",
    borderRadius: radius.xl,
    border: `1px solid ${theme.colors.borderColor}`,
    overflow: "hidden",
    fontFamily: theme.fontFamily,
    "& *::selection": {
      backgroundColor: theme.colors.primaryText,
      color: theme.colors.modalBg,
    },
    "& *": {
      boxSizing: "border-box",
    },
  };
});
