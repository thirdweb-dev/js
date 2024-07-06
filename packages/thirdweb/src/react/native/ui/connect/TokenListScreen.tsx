import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
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
import { RNImage } from "../components/RNImage.js";
import { Skeleton } from "../components/Skeleton.js";
import { TokenIcon } from "../components/TokenIcon.js";
import { ThemedText } from "../components/text.js";
import { RIGHT_CHEVRON } from "../icons/svgs.js";

export type TokenListScreenProps = {
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
          chain={chain}
          address={account?.address}
          client={props.client}
          theme={props.theme}
          onTokenSelected={props.onTokenSelected}
        />
        {tokens.map((t) => {
          return (
            <TokenRow
              chain={chain}
              client={props.client}
              address={account?.address}
              theme={props.theme}
              token={t}
              onTokenSelected={props.onTokenSelected}
              key={t.address}
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
        token={token}
        size={40}
        chain={chain}
        client={client}
        theme={theme}
      />
      <View style={{ flexDirection: "column", gap: spacing.xxs }}>
        <ThemedText theme={theme} type="defaultSemiBold">
          {tokenName}
        </ThemedText>
        {address && (
          <>
            {balanceQuery.data ? (
              <ThemedText theme={theme} type="subtext">
                {Number(balanceQuery.data.displayValue).toFixed(3)}{" "}
                {balanceQuery.data?.symbol}
              </ThemedText>
            ) : (
              <Skeleton theme={theme} style={{ width: 80, height: 14 }} />
            )}
          </>
        )}
      </View>
      {props.onTokenSelected && (
        <>
          <View style={{ flex: 1 }} />
          <RNImage
            theme={theme}
            size={24}
            data={RIGHT_CHEVRON}
            color={theme.colors.secondaryIconColor}
          />
        </>
      )}
    </>
  );
  return onTokenSelected ? (
    <TouchableOpacity
      style={styles.tokenRowContainer}
      onPress={() => onTokenSelected(token)}
    >
      {inner}
    </TouchableOpacity>
  ) : (
    <View style={styles.tokenRowContainer}>{inner}</View>
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
    gap: spacing.md,
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
