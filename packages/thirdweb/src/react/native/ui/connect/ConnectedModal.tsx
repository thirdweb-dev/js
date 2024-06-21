import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainQuery } from "../../../core/hooks/others/useChainQuery.js";
import { useConnectedWalletDetails } from "../../../core/utils/wallet.js";
import { fontSize, radius, spacing } from "../../design-system/index.js";
import { useActiveWalletChain } from "../../hooks/wallets/useActiveWalletChain.js";
import { useDisconnect } from "../../hooks/wallets/useDisconnect.js";
import { ChainIcon } from "../components/ChainIcon.js";
import { Header } from "../components/Header.js";
import { RNImage } from "../components/RNImage.js";
import { WalletImage } from "../components/WalletImage.js";
import { ThemedButton } from "../components/button.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { ThemedView } from "../components/view.js";
import {
  CLOSE_ICON,
  COINS_ICON,
  EXIT_ICON,
  RECEIVE_ICON,
  SEND_ICON,
} from "../icons/svgs.js";
import { TokenListScreen } from "./TokenListScreen.js";

type ConnectedModalState =
  | {
      screen: "account";
    }
  | { screen: "send" }
  | { screen: "receive" }
  | { screen: "view_funds" };

type ConnectedModalProps = ConnectButtonProps & {
  theme: Theme;
  wallet: Wallet;
  account: Account;
  onClose?: () => void;
  containerType: "modal" | "embed";
};

type ConnectedModalPropsInner = ConnectedModalProps & {
  setModalState: (state: ConnectedModalState) => void;
};

export function ConnectedModal(props: ConnectedModalProps) {
  const { theme, containerType, client } = props;
  const [modalState, setModalState] = useState<ConnectedModalState>({
    screen: "account",
  });

  let content: JSX.Element;

  switch (modalState.screen) {
    case "send": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            onBack={() => setModalState({ screen: "account" })}
            containerType={containerType}
            title="Send Funds"
          />
        </>
      );
      break;
    }
    case "receive": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            onBack={() => setModalState({ screen: "account" })}
            containerType={containerType}
            title="Receive Funds"
          />
        </>
      );
      break;
    }
    case "view_funds": {
      content = (
        <>
          <Header
            theme={theme}
            onClose={props.onClose}
            onBack={() => setModalState({ screen: "account" })}
            containerType={containerType}
            title="View Funds"
          />
          <Spacer size="xl" />
          <TokenListScreen
            client={client}
            theme={theme}
            supportedTokens={props.supportedTokens}
          />
        </>
      );
      break;
    }
    default: {
      content = (
        <>
          {props.onClose && (
            <TouchableOpacity
              onPress={props.onClose}
              style={{
                padding: spacing.lg,
                position: "absolute",
                right: 0,
                top: 0,
                zIndex: 1,
              }}
            >
              <RNImage
                data={CLOSE_ICON}
                size={24}
                color={theme.colors.secondaryIconColor}
              />
            </TouchableOpacity>
          )}
          <Spacer size="xl" />
          <AccountHeader {...props} />
          <Spacer size="lg" />
          <WalletActionsRow {...props} setModalState={setModalState} />
          <Spacer size="xl" />
          <WalletMenu {...props} setModalState={setModalState} />
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
    </ThemedView>
  );
}

const AccountHeader = (props: ConnectedModalProps) => {
  const { account, wallet, theme } = props;
  const walletChain = useActiveWalletChain();
  const { ensAvatarQuery, addressOrENS, balanceQuery } =
    useConnectedWalletDetails(
      props.client,
      walletChain,
      account,
      props.detailsButton?.displayBalanceToken,
    );
  return (
    <View style={styles.accountHeaderContainer}>
      <WalletImage
        size={84}
        account={account}
        wallet={wallet}
        ensAvatar={ensAvatarQuery.data}
      />
      <Spacer size="sm" />
      <ThemedText theme={theme} type="defaultSemiBold">
        {addressOrENS}
      </ThemedText>
      <Spacer size="xs" />
      <ThemedText
        theme={theme}
        type="subtext"
        style={{
          fontSize: fontSize.sm,
          fontWeight: 600,
        }}
      >
        {balanceQuery.data
          ? Number(balanceQuery.data.displayValue).toFixed(3)
          : "---"}{" "}
        {balanceQuery.data?.symbol}{" "}
      </ThemedText>
    </View>
  );
};

const WalletActionsRow = (props: ConnectedModalPropsInner) => {
  const { theme, setModalState } = props;
  return (
    <View style={styles.walletActionRowContainer}>
      <ThemedButton
        theme={theme}
        variant="secondary"
        style={styles.walletActionButton}
        onPress={() => setModalState({ screen: "send" })}
      >
        <RNImage
          size={24}
          data={SEND_ICON}
          color={theme.colors.secondaryIconColor}
        />
        <ThemedText theme={theme} type="defaultSemiBold">
          Send
        </ThemedText>
      </ThemedButton>
      <ThemedButton
        theme={theme}
        variant="secondary"
        style={styles.walletActionButton}
        onPress={() => setModalState({ screen: "receive" })}
      >
        <RNImage
          size={24}
          data={RECEIVE_ICON}
          color={theme.colors.secondaryIconColor}
        />
        <ThemedText theme={theme} type="defaultSemiBold">
          Receive
        </ThemedText>
      </ThemedButton>
      {/** TODO (rn) Buy button here */}
    </View>
  );
};

const WalletMenu = (props: ConnectedModalPropsInner) => {
  return (
    <View style={styles.walletMenuContainer}>
      <ChainSwitcher {...props} />
      <ViewFunds {...props} />
      <DisconnectWallet {...props} />
    </View>
  );
};

const ChainSwitcher = (props: ConnectedModalPropsInner) => {
  const { client, wallet, theme } = props;
  const chain = wallet.getChain();
  const chainQuery = useChainQuery(chain);
  return (
    <TouchableOpacity style={styles.walletMenuRow}>
      <ChainIcon client={client} size={32} chainIcon={chainQuery.data?.icon} />
      <ThemedText theme={theme} type="defaultSemiBold">
        {chainQuery.data?.name || "---"}
      </ThemedText>
    </TouchableOpacity>
  );
};

const ViewFunds = (props: ConnectedModalPropsInner) => {
  const { theme, setModalState } = props;
  return (
    <TouchableOpacity
      style={styles.walletMenuRow}
      onPress={() => setModalState({ screen: "view_funds" })}
    >
      <RNImage
        size={32}
        data={COINS_ICON}
        color={theme.colors.secondaryIconColor}
      />
      <ThemedText theme={theme} type="defaultSemiBold">
        View Funds
      </ThemedText>
    </TouchableOpacity>
  );
};

const DisconnectWallet = (props: ConnectedModalProps) => {
  const { wallet, theme, onClose } = props;
  const { disconnect } = useDisconnect();
  return (
    <TouchableOpacity
      style={styles.walletMenuRow}
      onPress={() => {
        onClose?.();
        disconnect(wallet);
      }}
    >
      <RNImage
        size={32}
        data={EXIT_ICON}
        color={theme.colors.secondaryIconColor}
      />
      <ThemedText theme={theme} type="defaultSemiBold">
        Disconnect Wallet
      </ThemedText>
    </TouchableOpacity>
  );
};

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
  accountHeaderContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  walletActionRowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  walletActionButton: { flex: 1, padding: spacing.smd, gap: spacing.smd },
  walletMenuContainer: {
    flexDirection: "column",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  walletMenuRow: {
    width: 300,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: spacing.md,
  },
});
