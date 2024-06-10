"use client";
import { useEffect, useMemo } from "react";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../../core/design-system/index.js";
import { useSiweAuth } from "../../../../core/hooks/auth/useSiweAuth.js";
import { AutoConnect } from "../../../../core/hooks/connection/AutoConnect.js";
import type { ConnectEmbedProps } from "../../../../core/hooks/connection/ConnectEmbedProps.js";
import {
  useActiveAccount,
  useIsAutoConnecting,
} from "../../../../core/hooks/wallets/wallet-hooks.js";
import { ConnectUIContext } from "../../../../core/providers/wallet-connection.js";
import { WalletUIStatesProvider } from "../../../providers/wallet-ui-states-provider.js";
import { canFitWideModal } from "../../../utils/canFitWideModal.js";
import { getDefaultWallets } from "../../../wallets/defaultWallets.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { DynamicHeight } from "../../components/DynamicHeight.js";
import { StyledDiv } from "../../design-system/elements.js";
import {
  modalMaxWidthCompact,
  modalMaxWidthWide,
  reservedScreens,
  wideModalMaxHeight,
} from "../constants.js";
import { useConnectLocale } from "../locale/getConnectLocale.js";
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
 *    appMetadata={{
 *      name: "Example",
 *      url: "https://example.com",
 *    }}
 * />
 * ```
 * @param props -
 * The props for the `ConnectEmbed` component.
 *
 * Refer to the [`ConnectEmbedProps`](https://portal.thirdweb.com/references/typescript/v5/ConnectEmbedProps) type for more details
 * @component
 */
export function ConnectEmbed(props: ConnectEmbedProps) {
  const activeAccount = useActiveAccount();
  const siweAuth = useSiweAuth(props.auth);
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

  const modalSize =
    !canFitWideModal() || wallets.length === 1
      ? "compact"
      : props.modalSize || ("compact" as const);

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
          <CustomThemeProvider theme={props.theme || "dark"}>
            <EmbedContainer modalSize={modalSize}>
              <LoadingScreen />
            </EmbedContainer>
          </CustomThemeProvider>
        </>
      );
    }

    return (
      <ConnectUIContext.Provider
        value={{
          appMetadata: props.appMetadata,
          client: props.client,
          wallets: wallets,
          locale: localeId,
          connectLocale: localeQuery.data,
          chain: props.chain || props.accountAbstraction?.chain,
          chains: props.chains,
          walletConnect: props.walletConnect,
          accountAbstraction: props.accountAbstraction,
          recommendedWallets: props.recommendedWallets,
          showAllWallets: props.showAllWallets,
          isEmbed: true,
          connectModal: {
            size: modalSize,
            privacyPolicyUrl: props.privacyPolicyUrl,
            showThirdwebBranding: props.showThirdwebBranding !== false,
            termsOfServiceUrl: props.termsOfServiceUrl,
          },
          onConnect: props.onConnect,
          auth: props.auth,
        }}
      >
        <WalletUIStatesProvider theme={props.theme} isOpen={true}>
          <ConnectEmbedContent {...props} onConnect={props.onConnect} />
          {autoConnectComp}
        </WalletUIStatesProvider>
      </ConnectUIContext.Provider>
    );
  }

  return <div>{autoConnectComp}</div>;
}

/**
 * @internal
 */
const ConnectEmbedContent = (
  props: ConnectEmbedProps & {
    loginOptional?: boolean;
  },
) => {
  // const requiresSignIn = false;
  const screenSetup = useSetupScreen();
  const { setScreen, initialScreen } = screenSetup;
  const siweAuth = useSiweAuth(props.auth);
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

const EmbedContainer = /* @__PURE__ */ StyledDiv(
  (props: { modalSize: "compact" | "wide" }) => {
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
  },
);
