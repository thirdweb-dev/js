import { useCallback, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import type { MultiStepAuthProviderType } from "../../../../wallets/in-app/core/authentication/type.js";
import type { InAppWalletAuth } from "../../../../wallets/in-app/core/wallet/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import type { ConnectEmbedProps } from "../../../core/hooks/connection/ConnectEmbedProps.js";
import { genericWalletIcon } from "../../../core/utils/socialIcons.js";
import { useWalletInfo } from "../../../core/utils/wallet.js";
import { radius, spacing } from "../../design-system/index.js";
import { useActiveWallet } from "../../hooks/wallets/useActiveWallet.js";
import { connectionManager } from "../../index.js";
import { getDefaultWallets } from "../../wallets/defaultWallets.js";
import { type ContainerType, Header } from "../components/Header.js";
import { RNImage } from "../components/RNImage.js";
import {
  WalletImage,
  getAuthProviderImage,
} from "../components/WalletImage.js";
import { ThemedButtonWithIcon } from "../components/button.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { ThemedView } from "../components/view.js";
import { TW_ICON } from "../icons/svgs.js";
import { ErrorView } from "./ErrorView.js";
import { ExternalWalletsList } from "./ExternalWalletsList.js";
import { InAppWalletUI, OtpLogin } from "./InAppWalletUI.js";
import WalletLoadingThumbnail from "./WalletLoadingThumbnail.js";

export type ModalState =
  | { screen: "base" }
  | { screen: "connecting"; wallet: Wallet; authMethod?: InAppWalletAuth }
  | { screen: "error"; error: string }
  | { screen: "otp"; auth: MultiStepAuthProviderType; wallet: Wallet<"inApp"> }
  | { screen: "external_wallets" };

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
  const theme = parseTheme(props.theme);
  const wallet = useActiveWallet();
  const adaptedProps = {
    ...props,
    connectModal: { ...props },
  } as ConnectButtonProps;
  return wallet ? null : (
    <ConnectModal {...adaptedProps} theme={theme} containerType="embed" />
  );
}

export function ConnectModal(
  props: ConnectButtonProps & {
    theme: Theme;
    onClose?: () => void;
    containerType: ContainerType;
  },
) {
  const {
    theme,
    client,
    containerType,
    accountAbstraction,
    onConnect,
    onClose,
  } = props;
  const [modalState, setModalState] = useState<ModalState>({ screen: "base" });
  const connector = useCallback(
    async (args: {
      wallet: Wallet;
      connectFn: () => Promise<Wallet>;
      authMethod?: InAppWalletAuth;
    }) => {
      setModalState({
        screen: "connecting",
        wallet: args.wallet,
        authMethod: args.authMethod,
      });
      try {
        const w = await args.connectFn();
        await connectionManager.connect(w, {
          client,
          accountAbstraction,
          onConnect,
        });
        onClose?.();
      } catch (error) {
        setModalState({
          screen: "error",
          error: (error as Error)?.message || "unknown error",
        });
      }
    },
    [client, accountAbstraction, onConnect, onClose],
  );
  const wallets = props.wallets || getDefaultWallets(props);
  const inAppWallet = wallets.find((wallet) => wallet.id === "inApp") as
    | Wallet<"inApp">
    | undefined;
  const externalWallets = wallets.filter((wallet) => wallet.id !== "inApp");
  const showBranding = props.connectModal?.showThirdwebBranding !== false;
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
          />
          <Spacer size="lg" />
          <ExternalWalletsList
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
          />
          {containerType === "modal" ? (
            <View style={{ flex: 1 }} />
          ) : (
            <Spacer size="lg" />
          )}
          <LoadingView
            theme={theme}
            wallet={modalState.wallet}
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
    case "error": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            containerType={containerType}
            onBack={() => setModalState({ screen: "base" })}
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
                      icon={genericWalletIcon}
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
              <Spacer size="lg" />
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

function LoadingView({
  theme,
  wallet,
  authProvider,
}: { theme: Theme; wallet: Wallet; authProvider?: InAppWalletAuth }) {
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
      <WalletLoadingThumbnail theme={theme} imageSize={100}>
        {authProvider ? (
          <View
            style={{
              borderRadius: spacing.md,
              padding: spacing.xs,
            }}
          >
            <RNImage
              theme={theme}
              size={90}
              data={getAuthProviderImage(authProvider)}
            />
          </View>
        ) : (
          <WalletImage theme={theme} size={90} wallet={wallet} />
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
          ? `Sign into your ${capitalizeFirstLetter(authProvider)} account`
          : `Accept the connection request in ${walletInfo.data?.name}`}
      </ThemedText>
    </View>
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
