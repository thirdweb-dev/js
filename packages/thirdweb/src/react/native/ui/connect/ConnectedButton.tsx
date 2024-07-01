import { StyleSheet, View } from "react-native";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useConnectedWalletDetails } from "../../../core/utils/wallet.js";
import { fontSize, spacing } from "../../design-system/index.js";
import { useActiveWalletChain } from "../../hooks/wallets/useActiveWalletChain.js";
import { WalletImage } from "../components/WalletImage.js";
import { ThemedButton } from "../components/button.js";
import { ThemedText } from "../components/text.js";

export function ConnectedButton(
  props: ConnectButtonProps & {
    openModal: () => void;
    onClose: () => void;
    wallet: Wallet;
    account: Account;
  },
) {
  const theme = parseTheme(props.theme);
  const { account, wallet } = props;
  const walletChain = useActiveWalletChain();
  const { ensAvatarQuery, addressOrENS, balanceQuery } =
    useConnectedWalletDetails(
      props.client,
      walletChain,
      account,
      props.detailsButton?.displayBalanceToken,
    );
  return (
    wallet &&
    account && (
      <ThemedButton
        theme={theme}
        onPress={() => {
          props.openModal();
        }}
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.smd,
        }}
      >
        <View style={styles.row}>
          <WalletImage
            size={40}
            wallet={wallet}
            account={account}
            ensAvatar={ensAvatarQuery.data}
          />
          <View style={styles.col}>
            <ThemedText
              theme={theme}
              type="defaultSemiBold"
              style={{
                color: theme.colors.primaryButtonText,
                fontSize: fontSize.sm,
              }}
            >
              {addressOrENS}
            </ThemedText>
            <ThemedText
              theme={theme}
              type="subtext"
              style={{
                color: theme.colors.secondaryText,
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
        </View>
      </ThemedButton>
    )
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1,
    gap: spacing.md,
    alignItems: "center",
  },
  col: {
    flexDirection: "column",
    gap: spacing.xxs,
  },
});
