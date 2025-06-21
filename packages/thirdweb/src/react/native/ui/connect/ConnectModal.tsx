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
import { ThemedButton, ThemedButtonWithIcon } from "../components/button.js";
import { type ContainerType, Header } from "../components/Header.js";
import { RNImage } from "../components/RNImage.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { ThemedView } from "../components/view.js";
import {
  getAuthProviderImage,
  WalletImage,
} from "../components/WalletImage.js";
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
      containerType="embed"
      siweAuth={siweAuth}
      theme={theme}
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
        authMethod: args.authMethod,
        screen: "connecting",
        wallet: args.wallet,
      });
      try {
        const w = await args.connectFn(props.chain);
        await connectionManager.connect(w, {
          accountAbstraction,
          client,
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
          error: (error as Error)?.message || "Unknown error",
          screen: "error",
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
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            onClose={props.onClose}
            theme={theme}
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
              client={client}
              connector={connector}
              setScreen={setModalState}
              theme={theme}
              wallet={modalState.wallet}
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
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            onClose={props.onClose}
            theme={theme}
            title={props.connectModal?.title || "Sign in"}
          />
          <Spacer size="lg" />
          <ExternalWalletsList
            client={client}
            connector={connector}
            containerType={containerType}
            externalWallets={externalWallets}
            onShowAllWallets={() => setModalState({ screen: "all_wallets" })}
            showAllWalletsButton={props.showAllWallets !== false}
            theme={theme}
          />
        </>
      );
      break;
    }
    case "all_wallets": {
      content = (
        <>
          <Header
            containerType={containerType}
            onBack={() =>
              inAppWallet
                ? setModalState({ screen: "external_wallets" })
                : setModalState({ screen: "base" })
            }
            onClose={props.onClose}
            theme={theme}
            title={props.connectModal?.title || "Select Wallet"}
          />
          <Spacer size="lg" />
          <AllWalletsList
            client={client}
            connector={connector}
            containerType={containerType}
            externalWallets={externalWallets}
            theme={theme}
          />
        </>
      );
      break;
    }
    case "connecting": {
      content = (
        <>
          <Header
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            onClose={props.onClose}
            theme={theme}
            title={props.connectModal?.title || "Sign in"}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="lg" />
          )}
          <WalletLoadingView
            authProvider={modalState.authMethod}
            client={client}
            theme={theme}
            wallet={modalState.wallet}
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
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            onClose={props.onClose}
            theme={theme}
            title={props.connectModal?.title || "Sign in"}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="lg" />
          )}
          <PasskeyView
            client={client}
            connector={connector}
            setScreen={setModalState}
            theme={theme}
            wallet={modalState.wallet}
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
            containerType={containerType}
            onBack={props.onClose}
            onClose={props.onClose}
            theme={theme}
            title={props.connectModal?.title || "Sign in"}
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="lg" />
          )}
          <SignInView
            client={client}
            onDisconnect={() => setModalState({ screen: "base" })}
            onError={(error) => setModalState({ error, screen: "error" })}
            onSignIn={() => props.onClose?.()}
            siweAuth={siweAuth}
            theme={theme}
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
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
            onClose={props.onClose}
            theme={theme}
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
            containerType={containerType}
            onClose={props.onClose}
            theme={theme}
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
                  client={client}
                  connector={connector}
                  setScreen={setModalState}
                  theme={theme}
                  wallet={inAppWallet}
                />
                {externalWallets.length > 0 ? (
                  <>
                    <OrDivider theme={theme} />
                    <ThemedButtonWithIcon
                      icon={WALLET_ICON}
                      onPress={() =>
                        setModalState({ screen: "external_wallets" })
                      }
                      theme={theme}
                      title="Connect a wallet"
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
                  client={client}
                  connector={connector}
                  containerType={containerType}
                  externalWallets={externalWallets}
                  onShowAllWallets={() =>
                    setModalState({ screen: "all_wallets" })
                  }
                  showAllWalletsButton={props.showAllWallets !== false}
                  theme={theme}
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
      style={
        containerType === "modal"
          ? styles.modalContainer
          : styles.embedContainer
      }
      theme={theme}
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
        alignItems: "center",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        paddingVertical: spacing.xl,
      }}
    >
      <WalletLoadingThumbnail
        animate={true}
        imageSize={100}
        roundLoader={authProvider === "passkey"}
        theme={theme}
      >
        {authProvider ? (
          <View
            style={{
              borderRadius: spacing.md,
              padding: spacing.sm,
            }}
          >
            <RNImage
              color={theme.colors.accentButtonBg}
              data={getAuthProviderImage(authProvider)}
              size={80}
              theme={theme}
            />
          </View>
        ) : (
          <WalletImage
            client={client}
            size={90}
            theme={theme}
            wallet={wallet}
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
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          padding: spacing.xl,
        }}
      >
        <WalletLoadingThumbnail
          animate={isSigningIn}
          imageSize={100}
          theme={theme}
        >
          <WalletImage
            client={client}
            size={90}
            theme={theme}
            wallet={wallet}
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
          disabled={isSigningIn}
          onPress={async () => {
            try {
              await siweAuth.doLogin();
              onSignIn();
            } catch (e) {
              onError((e as Error)?.message || "Unknown error");
            }
          }}
          style={{ width: "100%" }}
          theme={theme}
          variant="accent"
        >
          <ThemedText
            style={{
              color: theme.colors.accentButtonText,
            }}
            theme={theme}
            type="defaultSemiBold"
          >
            Sign login request
          </ThemedText>
        </ThemedButton>
        <Spacer size="md" />
        <ThemedButton
          disabled={isSigningIn}
          onPress={async () => {
            disconnect(wallet);
            siweAuth.doLogout();
            onDisconnect();
          }}
          style={{ width: "100%" }}
          theme={theme}
          variant="secondary"
        >
          <ThemedText
            style={{
              color: theme.colors.secondaryButtonText,
            }}
            theme={theme}
            type="defaultSemiBold"
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
        alignItems: "center",
        flexDirection: "row",
        gap: spacing.lg,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.borderColor,
          flex: 1,
          height: 1,
        }}
      />
      <ThemedText style={{ color: theme.colors.secondaryText }} theme={theme}>
        OR
      </ThemedText>
      <View
        style={{
          backgroundColor: theme.colors.borderColor,
          flex: 1,
          height: 1,
        }}
      />
    </View>
  );
}

function PoweredByThirdweb({ theme }: { theme: Theme }) {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        gap: spacing.xs,
        justifyContent: "center",
        paddingBottom: Platform.OS === "android" ? spacing.md : spacing.lg,
      }}
    >
      <ThemedText theme={theme} type="subtext">
        Powered by
      </ThemedText>
      <SvgXml
        color={theme.colors.secondaryText}
        height={22}
        style={{ marginBottom: -2 }}
        width={22}
        xml={TW_ICON}
      />
      <ThemedText style={{ fontWeight: "600" }} theme={theme} type="subtext">
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
  embedContainer: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  modalContainer: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
});
