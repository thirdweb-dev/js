import { type JSX, useCallback, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { MultiStepAuthProviderType } from "../../../../wallets/in-app/core/authentication/types.js";
import type { InAppWalletAuth } from "../../../../wallets/in-app/core/wallet/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useSiweAuth } from "../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import type { ConnectEmbedProps } from "../../../core/hooks/connection/ConnectEmbedProps.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { useDisconnect } from "../../../core/hooks/wallets/useDisconnect.js";
import { useConnectionManager } from "../../../core/providers/connection-manager.js";
import { useWalletInfo } from "../../../core/utils/wallet.js";
import { radius, spacing } from "../../design-system/index.js";
import { getDefaultWallets } from "../../wallets/defaultWallets.js";
import { type ContainerType, Header } from "../components/Header.js";
import { RNImage } from "../components/RNImage.js";
import {
  WalletImage,
  getAuthProviderImage,
} from "../components/WalletImage.js";
import { ThemedButton, ThemedButtonWithIcon } from "../components/button.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { ThemedView } from "../components/view.js";
import { TW_ICON, WALLET_ICON } from "../icons/svgs.js";
import { ErrorView } from "./ErrorView.js";
import { AllWalletsList, ExternalWalletsList } from "./ExternalWalletsList.js";
import { InAppWalletUI, OtpLogin, PasskeyView } from "./InAppWalletUI.js";
import WalletLoadingThumbnail from "./WalletLoadingThumbnail.js";

export type ModalState =
  | { screen: "base" }
  | { screen: "connecting"; wallet: Wallet; authMethod?: InAppWalletAuth }
  | { screen: "error"; error: string }
  | { screen: "otp"; auth: MultiStepAuthProviderType; wallet: Wallet<"inApp"> }
  | { screen: "passkey"; wallet: Wallet<"inApp"> }
  | { screen: "external_wallets" }
  | { screen: "all_wallets" }
  | { screen: "auth" };

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
 * @walletConnection
 */
export function ConnectEmbed(props: ConnectEmbedProps) {
  const theme = parseTheme(props.theme);
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const siweAuth = useSiweAuth(wallet, account, props.auth);
  const needsAuth = siweAuth.requiresAuth && !siweAuth.isLoggedIn;
  const isConnected = wallet && !needsAuth;
  const adaptedProps = {
    ...props,
    connectModal: { ...props },
  } as ConnectButtonProps;
  return isConnected ? null : (
    <ConnectModal
      {...adaptedProps}
      theme={theme}
      containerType="embed"
      siweAuth={siweAuth}
    />
  );
}

export function ConnectModal(
  props: ConnectButtonProps & {
    theme: Theme;
    onClose?: () => void;
    containerType: ContainerType;
    siweAuth: ReturnType<typeof useSiweAuth>;
  },
) {
  const {
    theme,
    client,
    containerType,
    accountAbstraction,
    onConnect,
    onClose,
    siweAuth,
  } = props;
  const wallet = useActiveWallet();
  const needsAuth = wallet && siweAuth.requiresAuth && !siweAuth.isLoggedIn;
  const [modalState, setModalState] = useState<ModalState>(
    needsAuth ? { screen: "auth" } : { screen: "base" },
  );
  const wallets = props.wallets || getDefaultWallets(props);
  const inAppWallet = wallets.find((wallet) => wallet.id === "inApp") as
    | Wallet<"inApp">
    | undefined;
  const externalWallets = wallets.filter((wallet) => wallet.id !== "inApp");
  const showBranding = props.connectModal?.showThirdwebBranding !== false;
  const connectionManager = useConnectionManager();

  const connector = useCallback(
    async (args: {
      wallet: Wallet;
      connectFn: (chain?: Chain) => Promise<Wallet>;
      authMethod?: InAppWalletAuth;
    }) => {
      setModalState({
        screen: "connecting",
        wallet: args.wallet,
        authMethod: args.authMethod,
      });
      try {
        const w = await args.connectFn(props.chain);
        await connectionManager.connect(w, {
          client,
          accountAbstraction,
          onConnect,
        });
        if (siweAuth.requiresAuth && !siweAuth.isLoggedIn) {
          // if in-app wallet, signin headlessly
          // TODO (rn) handle signless smart wallets as well
          if (w.id === "inApp") {
            await siweAuth.doLogin();
            onClose?.();
          } else {
            setModalState({
              screen: "auth",
            });
          }
        } else {
          onClose?.();
        }
      } catch (error) {
        setModalState({
          screen: "error",
          error: (error as Error)?.message || "Unknown error",
        });
      }
    },
    [
      client,
      accountAbstraction,
      onConnect,
      onClose,
      siweAuth,
      connectionManager,
      props.chain,
    ],
  );

  let content: JSX.Element;

  switch (modalState.screen) {
    case "otp": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            title={props.connectModal?.title || "Sign in"}
          />
          <Spacer size="xl" />
          <View
            style={{
              flexDirection: "column",
              gap: spacing.md,
              paddingHorizontal: containerType === "modal" ? spacing.lg : 0,
            }}
          >
            <OtpLogin
              auth={modalState.auth}
              wallet={modalState.wallet}
              client={client}
              setScreen={setModalState}
              theme={theme}
              connector={connector}
            />
          </View>
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="md" />
          )}
        </>
      );
      break;
    }
    case "external_wallets": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            title={props.connectModal?.title || "Sign in"}
          />
          <Spacer size="lg" />
          <ExternalWalletsList
            theme={theme}
            externalWallets={externalWallets}
            client={client}
            connector={connector}
            containerType={containerType}
            showAllWalletsButton={props.showAllWallets !== false}
            onShowAllWallets={() => setModalState({ screen: "all_wallets" })}
          />
        </>
      );
      break;
    }
    case "all_wallets": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            containerType={containerType}
            onBack={() =>
              inAppWallet
                ? setModalState({ screen: "external_wallets" })
                : setModalState({ screen: "base" })
            }
            title={props.connectModal?.title || "Select Wallet"}
          />
          <Spacer size="lg" />
          <AllWalletsList
            theme={theme}
            externalWallets={externalWallets}
            client={client}
            connector={connector}
            containerType={containerType}
          />
        </>
      );
      break;
    }
    case "connecting": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            title={props.connectModal?.title || "Sign in"}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="lg" />
          )}
          <WalletLoadingView
            theme={theme}
            wallet={modalState.wallet}
            client={client}
            authProvider={modalState.authMethod}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="md" />
          )}
        </>
      );
      break;
    }
    case "passkey": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            title={props.connectModal?.title || "Sign in"}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="lg" />
          )}
          <PasskeyView
            wallet={modalState.wallet}
            client={client}
            setScreen={setModalState}
            theme={theme}
            connector={connector}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="md" />
          )}
        </>
      );
      break;
    }
    case "auth": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            containerType={containerType}
            onBack={props.onClose}
            title={props.connectModal?.title || "Sign in"}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="lg" />
          )}
          <SignInView
            theme={theme}
            client={client}
            siweAuth={siweAuth}
            onSignIn={() => props.onClose?.()}
            onError={(error) => setModalState({ screen: "error", error })}
            onDisconnect={() => setModalState({ screen: "base" })}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="md" />
          )}
        </>
      );
      break;
    }
    case "error": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            title={props.connectModal?.title || "Sign in"}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="lg" />
          )}
          <ErrorView theme={theme} title={modalState.error} />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="md" />
          )}
        </>
      );
      break;
    }
    default: {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            containerType={containerType}
            title={props.connectModal?.title || "Sign in"}
          />
          {inAppWallet ? (
            <>
              {containerType === "modal" ? (
                <View style={{ flex: 1 }} />
              ) : (
                <Spacer size="lg" />
              )}
              <View
                style={{
                  flexDirection: "column",
                  gap: spacing.md,
                  paddingHorizontal: containerType === "modal" ? spacing.lg : 0,
                }}
              >
                <InAppWalletUI
                  wallet={inAppWallet}
                  setScreen={setModalState}
                  client={client}
                  theme={theme}
                  connector={connector}
                />
                {externalWallets.length > 0 ? (
                  <>
                    <OrDivider theme={theme} />
                    <ThemedButtonWithIcon
                      theme={theme}
                      icon={WALLET_ICON}
                      title="Connect a wallet"
                      onPress={() =>
                        setModalState({ screen: "external_wallets" })
                      }
                    />
                  </>
                ) : null}
              </View>
              {containerType === "modal" ? (
                <View style={{ flex: 1 }} />
              ) : (
                <Spacer size="md" />
              )}
            </>
          ) : externalWallets.length > 0 ? (
            <>
              <Spacer size="xl" />
              <View
                style={{
                  flex: 1,
                }}
              >
                <ExternalWalletsList
                  theme={theme}
                  externalWallets={externalWallets}
                  client={client}
                  connector={connector}
                  containerType={containerType}
                  showAllWalletsButton={props.showAllWallets !== false}
                  onShowAllWallets={() =>
                    setModalState({ screen: "all_wallets" })
                  }
                />
              </View>
            </>
          ) : null}
        </>
      );
    }
  }

  return (
    <ThemedView
      theme={theme}
      style={
        containerType === "modal"
          ? styles.modalContainer
          : styles.embedContainer
      }
    >
      {content}
      {showBranding && <PoweredByThirdweb theme={theme} />}
    </ThemedView>
  );
}

function WalletLoadingView({
  theme,
  wallet,
  client,
  authProvider,
}: {
  theme: Theme;
  wallet: Wallet;
  client: ThirdwebClient;
  authProvider?: InAppWalletAuth;
}) {
  const walletInfo = useWalletInfo(wallet.id);
  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: spacing.xl,
      }}
    >
      <WalletLoadingThumbnail
        theme={theme}
        imageSize={100}
        animate={true}
        roundLoader={authProvider === "passkey"}
      >
        {authProvider ? (
          <View
            style={{
              borderRadius: spacing.md,
              padding: spacing.sm,
            }}
          >
            <RNImage
              theme={theme}
              size={80}
              data={getAuthProviderImage(authProvider)}
              color={theme.colors.accentButtonBg}
            />
          </View>
        ) : (
          <WalletImage
            theme={theme}
            size={90}
            wallet={wallet}
            client={client}
          />
        )}
      </WalletLoadingThumbnail>
      <Spacer size="xl" />
      <ThemedText theme={theme} type="subtitle">
        {authProvider
          ? `Connecting with ${capitalizeFirstLetter(authProvider)}`
          : "Awaiting confirmation"}
      </ThemedText>
      <Spacer size="sm" />
      <ThemedText theme={theme} type="subtext">
        {authProvider
          ? `Signing into your ${capitalizeFirstLetter(authProvider)} account`
          : `Accept the connection request in ${walletInfo.data?.name}`}
      </ThemedText>
    </View>
  );
}

function SignInView({
  theme,
  siweAuth,
  client,
  onSignIn,
  onError,
  onDisconnect,
}: {
  theme: Theme;
  siweAuth: ReturnType<typeof useSiweAuth>;
  client: ThirdwebClient;
  onSignIn: () => void;
  onError: (error: string) => void;
  onDisconnect: () => void;
}) {
  const wallet = useActiveWallet();
  const walletInfo = useWalletInfo(wallet?.id);
  const { disconnect } = useDisconnect();
  const isSigningIn = siweAuth.isLoggingIn || siweAuth.isLoading;
  return (
    wallet && (
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.xl,
        }}
      >
        <WalletLoadingThumbnail
          theme={theme}
          imageSize={100}
          animate={isSigningIn}
        >
          <WalletImage
            theme={theme}
            size={90}
            wallet={wallet}
            client={client}
          />
        </WalletLoadingThumbnail>
        <Spacer size="xl" />
        <ThemedText theme={theme} type="subtitle">
          Complete sign in
        </ThemedText>
        <Spacer size="xs" />
        <ThemedText theme={theme} type="subtext">
          Sign login request in {walletInfo.data?.name} to continue
        </ThemedText>
        <Spacer size="xl" />
        <ThemedButton
          theme={theme}
          variant="accent"
          disabled={isSigningIn}
          style={{ width: "100%" }}
          onPress={async () => {
            try {
              await siweAuth.doLogin();
              onSignIn();
            } catch (e) {
              onError((e as Error)?.message || "Unknown error");
            }
          }}
        >
          <ThemedText
            theme={theme}
            type="defaultSemiBold"
            style={{
              color: theme.colors.accentButtonText,
            }}
          >
            Sign login request
          </ThemedText>
        </ThemedButton>
        <Spacer size="md" />
        <ThemedButton
          theme={theme}
          variant="secondary"
          disabled={isSigningIn}
          style={{ width: "100%" }}
          onPress={async () => {
            disconnect(wallet);
            siweAuth.doLogout();
            onDisconnect();
          }}
        >
          <ThemedText
            theme={theme}
            type="defaultSemiBold"
            style={{
              color: theme.colors.secondaryButtonText,
            }}
          >
            Disconnect
          </ThemedText>
        </ThemedButton>
      </View>
    )
  );
}

function OrDivider({ theme }: { theme: Theme }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.lg,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: theme.colors.borderColor,
        }}
      />
      <ThemedText theme={theme} style={{ color: theme.colors.secondaryText }}>
        OR
      </ThemedText>
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: theme.colors.borderColor,
        }}
      />
    </View>
  );
}

function PoweredByThirdweb({ theme }: { theme: Theme }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.xs,
        paddingBottom: Platform.OS === "android" ? spacing.md : spacing.lg,
      }}
    >
      <ThemedText theme={theme} type="subtext">
        Powered by
      </ThemedText>
      <SvgXml
        xml={TW_ICON}
        width={22}
        height={22}
        style={{ marginBottom: -2 }}
        color={theme.colors.secondaryText}
      />
      <ThemedText theme={theme} type="subtext" style={{ fontWeight: "600" }}>
        thirdweb
      </ThemedText>
    </View>
  );
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  embedContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    backgroundColor: "transparent",
  },
});
