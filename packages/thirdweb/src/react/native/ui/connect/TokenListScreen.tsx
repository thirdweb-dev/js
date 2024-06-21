import { ScrollView, StyleSheet, View } from "react-native";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useWalletBalance } from "../../../core/hooks/others/useWalletBalance.js";
import {
  type SupportedTokens,
  type TokenInfo,
  defaultTokens,
} from "../../../core/utils/defaultTokens.js";
import { spacing } from "../../design-system/index.js";
import { useActiveAccount } from "../../hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../hooks/wallets/useActiveWalletChain.js";
import { TokenIcon } from "../components/TokenIcon.js";
import { ThemedText } from "../components/text.js";

export type TokenListScreenProps = {
  theme: Theme;
  client: ThirdwebClient;
  supportedTokens?: SupportedTokens;
};

export const TokenListScreen = (props: TokenListScreenProps) => {
  const supportedTokens = props.supportedTokens || defaultTokens;
  const chain = useActiveWalletChain();
  const account = useActiveAccount();
  const tokens = chain ? supportedTokens[chain.id] || [] : [];

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.listContainer}>
          <TokenRow
            chain={chain}
            address={account?.address}
            client={props.client}
            theme={props.theme}
          />
          {tokens.length ? (
            tokens.map((t) => {
              return (
                <TokenRow
                  chain={chain}
                  client={props.client}
                  address={account?.address}
                  theme={props.theme}
                  token={t}
                  key={t.address}
                />
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText theme={props.theme}>
                No tokens found on chain {chain?.id}
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const TokenRow = (props: {
  token?: TokenInfo;
  theme: Theme;
  client: ThirdwebClient;
  chain?: Chain;
  address?: string;
}) => {
  const { token, theme, address, chain, client } = props;
  const balanceQuery = useWalletBalance({
    address,
    chain,
    client,
    tokenAddress: token?.address,
  });
  const tokenName = props.token ? props.token.name : balanceQuery.data?.name;
  return (
    <View style={styles.tokenRowContainer}>
      <TokenIcon token={token} size={48} chain={chain} client={client} />
      <View style={{ flexDirection: "column", gap: spacing.xs }}>
        <ThemedText theme={theme} type="defaultSemiBold">
          {tokenName}
        </ThemedText>
        {address && (
          <ThemedText theme={theme} type="subtext">
            {balanceQuery.data
              ? `${balanceQuery.data.displayValue} ${balanceQuery.data.symbol}`
              : "---"}
          </ThemedText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: "column",
    flex: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  tokenRowContainer: {
    flexDirection: "row",
    gap: spacing.lg,
    alignItems: "center",
  },
  emptyContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
});
