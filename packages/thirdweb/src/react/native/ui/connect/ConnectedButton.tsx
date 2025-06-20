import { StyleSheet, View } from "react-native";
import { formatNumber } from "../../../../utils/formatNumber.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveWalletChain } from "../../../core/hooks/wallets/useActiveWalletChain.js";
import { useConnectedWalletDetails } from "../../../core/utils/wallet.js";
import { fontSize, spacing } from "../../design-system/index.js";
import { ThemedButton } from "../components/button.js";
import { Skeleton } from "../components/Skeleton.js";
import { ThemedText } from "../components/text.js";
import { WalletImage } from "../components/WalletImage.js";

export function ConnectedButton(
  props: ConnectButtonProps & {
    openModal: () => void;
    onClose: () => void;
    wallet: Wallet;
    account: Account;
  },
) {
  const theme = parseTheme(props.theme);
  const { account, wallet, client } = props;
  const walletChain = useActiveWalletChain();
  const { pfp, name, balanceQuery } = useConnectedWalletDetails(
    props.client,
    walletChain,
    account,
    props.detailsButton?.displayBalanceToken,
  );
  return (
    <ThemedButton
      onPress={() => {
        props.openModal();
      }}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.smd,
      }}
      theme={theme}
    >
      <View style={styles.row}>
        <WalletImage
          avatar={pfp}
          client={client}
          size={40}
          theme={theme}
          wallet={wallet}
        />
        <View style={styles.col}>
          <ThemedText
            style={{
              color: theme.colors.primaryButtonText,
            }}
            theme={theme}
            type="defaultSemiBold"
          >
            {name}
          </ThemedText>
          {balanceQuery.data ? (
            <ThemedText
              style={{
                fontSize: fontSize.sm,
              }}
              theme={theme}
              type="subtext"
            >
              {formatBalanceOnButton(Number(balanceQuery.data.displayValue))}{" "}
              {balanceQuery.data?.symbol}
            </ThemedText>
          ) : (
            <Skeleton
              color={theme.colors.secondaryText}
              style={{ height: 16, width: 80 }}
              theme={theme}
            />
          )}
        </View>
      </View>
    </ThemedButton>
  );
}

function formatBalanceOnButton(num: number) {
  return formatNumber(num, num < 1 ? 5 : 4);
}

const styles = StyleSheet.create({
  col: {
    flexDirection: "column",
    gap: spacing.xxs,
  },
  row: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.md,
  },
});
