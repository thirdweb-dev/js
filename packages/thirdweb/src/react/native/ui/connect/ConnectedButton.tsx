import { StyleSheet, View } from "react-native";
import { formatNumber } from "../../../../utils/formatNumber.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveWalletChain } from "../../../core/hooks/wallets/useActiveWalletChain.js";
import { useConnectedWalletDetails } from "../../../core/utils/wallet.js";
import { fontSize, spacing } from "../../design-system/index.js";
import { Skeleton } from "../components/Skeleton.js";
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
          theme={theme}
          size={40}
          wallet={wallet}
          avatar={pfp}
          client={client}
        />
        <View style={styles.col}>
          <ThemedText
            theme={theme}
            type="defaultSemiBold"
            style={{
              color: theme.colors.primaryButtonText,
            }}
          >
            {name}
          </ThemedText>
          {balanceQuery.data ? (
            <ThemedText
              theme={theme}
              type="subtext"
              style={{
                fontSize: fontSize.sm,
              }}
            >
              {formatBalanceOnButton(Number(balanceQuery.data.displayValue))}{" "}
              {balanceQuery.data?.symbol}
            </ThemedText>
          ) : (
            <Skeleton
              theme={theme}
              style={{ width: 80, height: 16 }}
              color={theme.colors.secondaryText}
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
