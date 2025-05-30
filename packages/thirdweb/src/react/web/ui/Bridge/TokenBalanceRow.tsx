import styled from "@emotion/styled";
import type { ThirdwebClient } from "../../../../../dist/types/client/client.js";
import type { Chain } from "../../../../chains/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { GetWalletBalanceResult } from "../../../../wallets/utils/getWalletBalance.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { spacing } from "../../../core/design-system/index.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainMetadata } from "../../../core/hooks/others/useChainQuery.js";
import type { TokenInfo } from "../../../core/utils/defaultTokens.js";
import { FiatValue } from "../ConnectWallet/screens/Buy/swap/FiatValue.js";
import { formatTokenBalance } from "../ConnectWallet/screens/formatTokenBalance.js";
import { ChainIcon } from "../components/ChainIcon.js";
import { TokenIcon } from "../components/TokenIcon.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Text } from "../components/text.js";

export function TokenBalanceRow(props: {
  client: ThirdwebClient;
  token: TokenInfo;
  chain: Chain;
  balance: GetWalletBalanceResult;
  wallet: Wallet;
  onClick: (token: TokenInfo, wallet: Wallet) => void;
  style?: React.CSSProperties;
}) {
  const { token, chain, balance, wallet, onClick, client, style } = props;
  const chainInfo = useChainMetadata(chain).data;
  const theme = useCustomTheme();
  return (
    <StyledButton
      onClick={() => onClick(token, wallet)}
      variant="secondary"
      style={{
        ...style,
        display: "flex",
        justifyContent: "space-between",
        minWidth: 0, // Needed for text truncation to work
      }}
    >
      <Container
        flex="row"
        center="y"
        gap="sm"
        style={{
          flex: "1 1 50%",
          minWidth: 0,
          maxWidth: "50%",
          overflow: "hidden",
          flexWrap: "nowrap",
        }}
      >
        <Container
          style={{
            position: "relative",
            width: iconSize.md,
            height: iconSize.md,
            flexShrink: 0,
            margin: spacing["4xs"],
          }}
        >
          <TokenIcon token={token} chain={chain} size="lg" client={client} />
          {chain.id !== 1 && (
            <Container
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: theme.colors.borderColor,
              }}
            >
              <ChainIcon
                chainIconUrl={chainInfo?.icon?.url}
                size="14"
                client={client}
              />
            </Container>
          )}
        </Container>

        <Container flex="column" gap="4xs" style={{ minWidth: 0 }}>
          <Text
            size="sm"
            color="primaryText"
            weight={600}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {token.name}
          </Text>
          {chainInfo && (
            <Text
              size="xs"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {chainInfo.name}
            </Text>
          )}
        </Container>
      </Container>

      <Container
        flex="row"
        center="y"
        gap="4xs"
        color="secondaryText"
        style={{
          flex: "1 1 50%",
          maxWidth: "50%",
          minWidth: 0,
          justifyContent: "flex-end",
          flexWrap: "nowrap",
        }}
      >
        <Container
          flex="column"
          color="secondaryText"
          gap="3xs"
          style={{
            alignItems: "flex-end",
            minWidth: 0,
            overflow: "hidden",
            marginRight: spacing["4xs"],
          }}
        >
          <FiatValue
            tokenAmount={balance.displayValue}
            token={token}
            chain={chain}
            client={client}
            color="primaryText"
            size="sm"
          />
          <Text
            size="xs"
            color="secondaryText"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {formatTokenBalance(balance, true, 2)}
          </Text>
        </Container>
      </Container>
    </StyledButton>
  );
}

const StyledButton = /* @__PURE__ */ styled(Button)((props) => {
  const theme = useCustomTheme();
  return {
    background: "transparent",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    flexDirection: "row",
    padding: spacing.sm,
    paddingRight: spacing.xs,
    gap: spacing.sm,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
      transform: "scale(1.01)",
    },
    transition: "background 200ms ease, transform 150ms ease",
    ...props.style,
  };
});
