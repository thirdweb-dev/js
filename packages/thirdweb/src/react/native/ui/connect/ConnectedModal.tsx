import { type JSX, useEffect, useState } from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getContract } from "../../../../contract/contract.js";
import { isContractDeployed } from "../../../../utils/bytecode/is-contract-deployed.js";
import { formatNumber } from "../../../../utils/formatNumber.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useSiweAuth } from "../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainName } from "../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../core/hooks/wallets/useActiveWalletChain.js";
import { useDisconnect } from "../../../core/hooks/wallets/useDisconnect.js";
import { hasSmartAccount } from "../../../core/utils/isSmartWallet.js";
import { useConnectedWalletDetails } from "../../../core/utils/wallet.js";
import { fontSize, radius, spacing } from "../../design-system/index.js";
import { Address } from "../components/Address.js";
import { ChainIcon } from "../components/ChainIcon.js";
import { type ContainerType, Header } from "../components/Header.js";
import { RNImage } from "../components/RNImage.js";
import { Skeleton } from "../components/Skeleton.js";
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
          theme={theme}
          client={client}
          onClose={props.onClose}
          onBack={() => setModalState({ screen: "account" })}
          containerType={containerType}
          supportedTokens={props.supportedTokens}
        />
      );
      break;
    }
    case "receive": {
      content = (
        <ReceiveScreen
          account={props.account}
          wallet={props.wallet}
          client={props.client}
          theme={theme}
          containerType={props.containerType}
          onBack={() => setModalState({ screen: "account" })}
          onClose={props.onClose}
        />
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
                theme={theme}
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
          <Spacer size="lg" />
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
        theme={theme}
        size={70}
        wallet={wallet}
        avatar={pfp}
        client={client}
      />
      <SmartAccountBadge client={props.client} theme={theme} />
      <Spacer size="smd" />
      <Address account={account} theme={theme} addressOrENS={name} />
      <Spacer size="xxs" />
      {balanceQuery.data ? (
        <ThemedText
          theme={theme}
          type="subtext"
          style={{
            fontSize: fontSize.sm,
          }}
        >
          {formatNumber(Number(balanceQuery.data.displayValue), 5)}{" "}
          {balanceQuery.data?.symbol}
        </ThemedText>
      ) : (
        <Skeleton theme={theme} style={{ width: 80, height: 16 }} />
      )}
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
          theme={theme}
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
          theme={theme}
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
      <ChainIcon client={client} size={32} chain={chain} theme={theme} />
      {name ? (
        <ThemedText theme={theme} type="defaultSemiBold">
          {name}
        </ThemedText>
      ) : (
        <Skeleton theme={theme} style={{ width: 80, height: 16 }} />
      )}
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
        theme={theme}
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
  const { wallet, account, theme, onClose } = props;
  const { disconnect } = useDisconnect();
  const siweAuth = useSiweAuth(wallet, account, props.auth);
  return (
    <TouchableOpacity
      style={styles.walletMenuRow}
      onPress={() => {
        onClose?.();
        disconnect(wallet);
        if (siweAuth.isLoggedIn) {
          siweAuth.doLogout();
        }
      }}
    >
      <RNImage
        theme={theme}
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

function SmartAccountBadge(props: {
  theme: Theme;
  client: ThirdwebClient;
}) {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const isSmartWallet = hasSmartAccount(activeWallet);
  const chain = useActiveWalletChain();
  const { client, theme } = props;

  const [isSmartWalletDeployed, setIsSmartWalletDeployed] = useState(false);

  useEffect(() => {
    if (activeAccount && isSmartWallet && activeAccount.address && chain) {
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
  }, [activeAccount, chain, client, isSmartWallet]);

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.xs,
        backgroundColor: theme.colors.secondaryButtonBg,
        borderRadius: radius.md,
        paddingVertical: spacing.xs,
        paddingLeft: spacing.sm,
        paddingRight: spacing.smd,
      }}
    >
      <RNImage
        theme={theme}
        data={SMART_WALLET_ICON}
        size={14}
        color={theme.colors.accentButtonBg}
      />
      <ThemedText
        theme={theme}
        style={{ color: theme.colors.primaryText, fontSize: fontSize.xs }}
      >
        Smart Account
      </ThemedText>
    </View>
  );

  if (chain && activeAccount && isSmartWallet) {
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
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: spacing.md,
  },
});
