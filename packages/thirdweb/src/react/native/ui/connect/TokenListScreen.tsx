import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { formatNumber } from "../../../../utils/formatNumber.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useWalletBalance } from "../../../core/hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../core/hooks/wallets/useActiveWalletChain.js";
import {
  defaultTokens,
  type SupportedTokens,
  type TokenInfo,
} from "../../../core/utils/defaultTokens.js";
import { spacing } from "../../design-system/index.js";
import { RNImage } from "../components/RNImage.js";
import { Skeleton } from "../components/Skeleton.js";
import { TokenIcon } from "../components/TokenIcon.js";
import { ThemedText } from "../components/text.js";
import { RIGHT_CHEVRON } from "../icons/svgs.js";

type TokenListScreenProps = {
  theme: Theme;
  client: ThirdwebClient;
  supportedTokens?: SupportedTokens;
  onTokenSelected?: (token?: TokenInfo) => void;
};

export const TokenListScreen = (props: TokenListScreenProps) => {
  const supportedTokens = props.supportedTokens || defaultTokens;
  const chain = useActiveWalletChain();
  const account = useActiveAccount();
  const tokens = chain ? supportedTokens[chain.id] || [] : [];

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.listContainer}>
        <TokenRow
          address={account?.address}
          chain={chain}
          client={props.client}
          onTokenSelected={props.onTokenSelected}
          theme={props.theme}
        />
        {tokens.map((t) => {
          return (
            <TokenRow
              address={account?.address}
              chain={chain}
              client={props.client}
              key={t.address}
              onTokenSelected={props.onTokenSelected}
              theme={props.theme}
              token={t}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export const TokenRow = (props: {
  token?: TokenInfo;
  theme: Theme;
  client: ThirdwebClient;
  chain?: Chain;
  address?: string;
  onTokenSelected?: (token?: TokenInfo) => void;
}) => {
  const { token, theme, address, chain, client, onTokenSelected } = props;
  const balanceQuery = useWalletBalance({
    address,
    chain,
    client,
    tokenAddress: token?.address,
  });
  const tokenName = props.token ? props.token.name : balanceQuery.data?.name;
  const inner = (
    <>
      <TokenIcon
        chain={chain}
        client={client}
        size={40}
        theme={theme}
        token={token}
      />
      <View style={{ flexDirection: "column", gap: spacing.xxs }}>
        <ThemedText theme={theme} type="defaultSemiBold">
          {tokenName}
        </ThemedText>
        {address &&
          (balanceQuery.data ? (
            <ThemedText theme={theme} type="subtext">
              {formatBalanceOnButton(Number(balanceQuery.data.displayValue))}{" "}
              {balanceQuery.data?.symbol}
            </ThemedText>
          ) : (
            <Skeleton style={{ height: 14, width: 80 }} theme={theme} />
          ))}
      </View>
      {props.onTokenSelected && (
        <>
          <View style={{ flex: 1 }} />
          <RNImage
            color={theme.colors.secondaryIconColor}
            data={RIGHT_CHEVRON}
            size={24}
            theme={theme}
          />
        </>
      )}
    </>
  );
  return onTokenSelected ? (
    <TouchableOpacity
      onPress={() => onTokenSelected(token)}
      style={styles.tokenRowContainer}
    >
      {inner}
    </TouchableOpacity>
  ) : (
    <View style={styles.tokenRowContainer}>{inner}</View>
  );
};

function formatBalanceOnButton(num: number) {
  return formatNumber(num, num < 1 ? 5 : 4);
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: spacing.lg,
  },
  listContainer: {
    flex: 1,
    flexDirection: "column",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tokenRowContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
});
