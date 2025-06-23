import { type JSX, useEffect, useState } from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getContract } from "../../../../contract/contract.js";
import { isContractDeployed } from "../../../../utils/bytecode/is-contract-deployed.js";
import { formatNumber } from "../../../../utils/formatNumber.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import { isSmartWallet } from "../../../../wallets/smart/is-smart-wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useSiweAuth } from "../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainName } from "../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../core/hooks/wallets/useActiveWalletChain.js";
import { useDisconnect } from "../../../core/hooks/wallets/useDisconnect.js";
import { useConnectedWalletDetails } from "../../../core/utils/wallet.js";
import { fontSize, radius, spacing } from "../../design-system/index.js";
import { Address } from "../components/Address.js";
import { ThemedButton } from "../components/button.js";
import { ChainIcon } from "../components/ChainIcon.js";
import { type ContainerType, Header } from "../components/Header.js";
import { RNImage } from "../components/RNImage.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { ThemedView } from "../components/view.js";
import { WalletImage } from "../components/WalletImage.js";
import {
  CLOSE_ICON,
  COINS_ICON,
  EXIT_ICON,
  RECEIVE_ICON,
  SEND_ICON,
  SMART_WALLET_ICON,
} from "../icons/svgs.js";
import { ReceiveScreen } from "./ReceiveScreen.js";
import { SendScreen } from "./SendScreen.js";
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
  containerType: ContainerType;
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
        <SendScreen
          client={client}
          containerType={containerType}
          onBack={() => setModalState({ screen: "account" })}
          onClose={props.onClose}
          supportedTokens={props.supportedTokens}
          theme={theme}
        />
      );
      break;
    }
    case "receive": {
      content = (
        <ReceiveScreen
          account={props.account}
          client={props.client}
          containerType={props.containerType}
          onBack={() => setModalState({ screen: "account" })}
          onClose={props.onClose}
          theme={theme}
          wallet={props.wallet}
        />
      );
      break;
    }
    case "view_funds": {
      content = (
        <>
          <Header
            containerType={containerType}
            onBack={() => setModalState({ screen: "account" })}
            onClose={props.onClose}
            theme={theme}
            title="View Funds"
          />
          <Spacer size="xl" />
          <TokenListScreen
            client={client}
            supportedTokens={props.supportedTokens}
            theme={theme}
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
                color={theme.colors.secondaryIconColor}
                data={CLOSE_ICON}
                size={24}
                theme={theme}
              />
            </TouchableOpacity>
          )}
          <Spacer size="xl" />
          <AccountHeader {...props} />
          <Spacer size="lg" />
          <WalletActionsRow {...props} setModalState={setModalState} />
          <Spacer size="lg" />
          <WalletMenu {...props} setModalState={setModalState} />
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
    </ThemedView>
  );
}

const AccountHeader = (props: ConnectedModalProps) => {
  const { account, wallet, theme, client } = props;
  const walletChain = useActiveWalletChain();
  const { pfp, name, balanceQuery } = useConnectedWalletDetails(
    props.client,
    walletChain,
    account,
    props.detailsButton?.displayBalanceToken,
  );
  return (
    <View style={styles.accountHeaderContainer}>
      <WalletImage
        avatar={pfp}
        client={client}
        size={70}
        theme={theme}
        wallet={wallet}
      />
      <SmartAccountBadge client={props.client} theme={theme} />
      <Spacer size="smd" />
      <Address account={account} addressOrENS={name} theme={theme} />
      <Spacer size="xxs" />
      {balanceQuery.data ? (
        <ThemedText
          style={{
            fontSize: fontSize.sm,
          }}
          theme={theme}
          type="subtext"
        >
          {formatNumber(Number(balanceQuery.data.displayValue), 5)}{" "}
          {balanceQuery.data?.symbol}
        </ThemedText>
      ) : (
        <Skeleton style={{ height: 16, width: 80 }} theme={theme} />
      )}
    </View>
  );
};

const WalletActionsRow = (props: ConnectedModalPropsInner) => {
  const { theme, setModalState } = props;
  return (
    <View style={styles.walletActionRowContainer}>
      <ThemedButton
        onPress={() => setModalState({ screen: "send" })}
        style={styles.walletActionButton}
        theme={theme}
        variant="secondary"
      >
        <RNImage
          color={theme.colors.secondaryIconColor}
          data={SEND_ICON}
          size={24}
          theme={theme}
        />
        <ThemedText theme={theme} type="defaultSemiBold">
          Send
        </ThemedText>
      </ThemedButton>
      <ThemedButton
        onPress={() => setModalState({ screen: "receive" })}
        style={styles.walletActionButton}
        theme={theme}
        variant="secondary"
      >
        <RNImage
          color={theme.colors.secondaryIconColor}
          data={RECEIVE_ICON}
          size={24}
          theme={theme}
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
      {/* TODO (rn) implement transactions screen */}
      {/* <Transactions {...props} /> */}
      <ViewFunds {...props} />
      <DisconnectWallet {...props} />
    </View>
  );
};

const ChainSwitcher = (props: ConnectedModalPropsInner) => {
  const { client, wallet, theme } = props;
  const chain = wallet.getChain();
  const { name } = useChainName(chain);
  return (
    <TouchableOpacity style={styles.walletMenuRow}>
      <ChainIcon chain={chain} client={client} size={32} theme={theme} />
      {name ? (
        <ThemedText theme={theme} type="defaultSemiBold">
          {name}
        </ThemedText>
      ) : (
        <Skeleton style={{ height: 16, width: 80 }} theme={theme} />
      )}
    </TouchableOpacity>
  );
};

const ViewFunds = (props: ConnectedModalPropsInner) => {
  const { theme, setModalState } = props;
  return (
    <TouchableOpacity
      onPress={() => setModalState({ screen: "view_funds" })}
      style={styles.walletMenuRow}
    >
      <RNImage
        color={theme.colors.secondaryIconColor}
        data={COINS_ICON}
        size={32}
        theme={theme}
      />
      <ThemedText theme={theme} type="defaultSemiBold">
        View Funds
      </ThemedText>
    </TouchableOpacity>
  );
};

const DisconnectWallet = (props: ConnectedModalProps) => {
  const { wallet, account, theme, onClose } = props;
  const { disconnect } = useDisconnect();
  const siweAuth = useSiweAuth(wallet, account, props.auth);
  return (
    <TouchableOpacity
      onPress={() => {
        onClose?.();
        disconnect(wallet);
        if (siweAuth.isLoggedIn) {
          siweAuth.doLogout();
        }
      }}
      style={styles.walletMenuRow}
    >
      <RNImage
        color={theme.colors.secondaryIconColor}
        data={EXIT_ICON}
        size={32}
        theme={theme}
      />
      <ThemedText theme={theme} type="defaultSemiBold">
        Disconnect Wallet
      </ThemedText>
    </TouchableOpacity>
  );
};

function SmartAccountBadge(props: { theme: Theme; client: ThirdwebClient }) {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const isSW = isSmartWallet(activeWallet);
  const chain = useActiveWalletChain();
  const { client, theme } = props;

  const [isSmartWalletDeployed, setIsSmartWalletDeployed] = useState(false);

  useEffect(() => {
    if (activeAccount && isSW && activeAccount.address && chain) {
      const contract = getContract({
        address: activeAccount.address,
        chain,
        client,
      });

      isContractDeployed(contract).then((isDeployed) => {
        setIsSmartWalletDeployed(isDeployed);
      });
    } else {
      setIsSmartWalletDeployed(false);
    }
  }, [activeAccount, chain, client, isSW]);

  const content = (
    <View
      style={{
        alignItems: "center",
        backgroundColor: theme.colors.secondaryButtonBg,
        borderRadius: radius.md,
        flexDirection: "row",
        gap: spacing.xs,
        justifyContent: "center",
        paddingLeft: spacing.sm,
        paddingRight: spacing.smd,
        paddingVertical: spacing.xs,
      }}
    >
      <RNImage
        color={theme.colors.accentButtonBg}
        data={SMART_WALLET_ICON}
        size={14}
        theme={theme}
      />
      <ThemedText
        style={{ color: theme.colors.primaryText, fontSize: fontSize.xs }}
        theme={theme}
      >
        Smart Account
      </ThemedText>
    </View>
  );

  if (chain && activeAccount && isSW) {
    return (
      <>
        <Spacer size="smd" />
        {isSmartWalletDeployed ? (
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `https://thirdweb.com/${chain.id}/${activeAccount.address}/account`,
              )
            }
          >
            {content}
          </TouchableOpacity>
        ) : (
          <View>{content}</View>
        )}
      </>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  accountHeaderContainer: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
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
  walletActionButton: { flex: 1, gap: spacing.smd, padding: spacing.smd },
  walletActionRowContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-evenly",
    paddingHorizontal: spacing.lg,
  },
  walletMenuContainer: {
    flexDirection: "column",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  walletMenuRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "flex-start",
  },
});
