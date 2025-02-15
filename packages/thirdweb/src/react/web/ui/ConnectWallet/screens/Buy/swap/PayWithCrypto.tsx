import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { Account } from "../../../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  radius,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { useWalletBalance } from "../../../../../../core/hooks/others/useWalletBalance.js";
import type { TokenInfo } from "../../../../../../core/utils/defaultTokens.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Container } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";
import { TokenRow } from "../../../../components/token/TokenRow.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import { formatTokenBalance } from "../../formatTokenBalance.js";
import { type NativeToken, isNativeToken } from "../../nativeToken.js";
import { WalletRow } from "./TokenSelectorScreen.js";

/**
 * Shows an amount "value" and renders the selected token and chain
 * It also renders the buttons to select the token and chain
 * It also renders the balance of active wallet for the selected token in selected chain
 * @internal
 */
export function PayWithCryptoQuoteInfo(props: {
  value: string;
  chain: Chain;
  token: TokenInfo | NativeToken;
  isLoading: boolean;
  client: ThirdwebClient;
  freezeChainAndTokenSelection?: boolean;
  payerAccount: Account;
  swapRequired: boolean;
  onSelectToken: () => void;
}) {
  const theme = useCustomTheme();
  const balanceQuery = useWalletBalance({
    address: props.payerAccount.address,
    chain: props.chain,
    tokenAddress: isNativeToken(props.token) ? undefined : props.token.address,
    client: props.client,
  });

  return (
    <Container
      bg="tertiaryBg"
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${theme.colors.borderColor}`,
        ...(props.swapRequired
          ? {
              borderBottom: "none",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }
          : {}),
      }}
    >
      {/* Wallet and balance */}
      <Container
        flex="row"
        gap="sm"
        style={{
          justifyContent: "space-between",
          padding: spacing.sm,
          borderBottom: `1px solid ${theme.colors.borderColor}`,
        }}
      >
        <WalletRow client={props.client} address={props.payerAccount.address} />
        {balanceQuery.data ? (
          <Container flex="row" gap="3xs" center="y">
            <Text size="xs" color="secondaryText" weight={500}>
              {formatTokenBalance(balanceQuery.data, false)}
            </Text>
            <TokenSymbol
              token={props.token}
              chain={props.chain}
              size="xs"
              color="secondaryText"
            />
          </Container>
        ) : (
          <Skeleton width="70px" height={fontSize.xs} />
        )}
      </Container>
      {/* Quoted price */}
      <TokenRow
        token={props.token}
        chain={props.chain}
        client={props.client}
        isLoading={props.isLoading}
        value={props.value}
        onSelectToken={props.onSelectToken}
        style={{
          border: "none",
          borderRadius: 0,
        }}
      />
    </Container>
  );
}
