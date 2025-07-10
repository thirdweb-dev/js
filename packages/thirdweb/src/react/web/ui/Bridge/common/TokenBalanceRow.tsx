import styled from "@emotion/styled";
import type { Token } from "../../../../../bridge/index.js";
import { getCachedChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { spacing } from "../../../../core/design-system/index.js";
import { FiatValue } from "../../ConnectWallet/screens/Buy/swap/FiatValue.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import { TokenAndChain } from "./TokenAndChain.js";

export function TokenBalanceRow({
  client,
  token,
  amount,
  onClick,
  style,
  currency,
}: {
  client: ThirdwebClient;
  token: Token;
  amount: string;
  onClick: (token: Token) => void;
  style?: React.CSSProperties;
  currency?: SupportedFiatCurrency;
}) {
  const chain = getCachedChain(token.chainId);
  return (
    <StyledButton
      onClick={() => onClick(token)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: `${spacing.sm} ${spacing.md}`,
        ...style,
      }}
      variant="secondary"
    >
      <TokenAndChain
        client={client}
        size="lg"
        style={{ flex: 1, maxWidth: "50%" }}
        token={token}
      />

      <Container
        center="y"
        color="secondaryText"
        flex="row"
        gap="4xs"
        style={{
          flex: "1",
          flexWrap: "nowrap",
          justifyContent: "flex-end",
          maxWidth: "50%",
          minWidth: 0,
        }}
      >
        <Container
          color="secondaryText"
          flex="column"
          gap="3xs"
          style={{
            alignItems: "flex-end",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <FiatValue
            currency={currency}
            chain={chain}
            client={client}
            color="primaryText"
            size="sm"
            token={token}
            tokenAmount={amount}
          />
          <Text
            color="secondaryText"
            size="xs"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {`${Number(amount).toLocaleString(undefined, {
              maximumFractionDigits: 6,
              minimumFractionDigits: 0,
            })} ${token.symbol}`}
          </Text>
        </Container>
      </Container>
    </StyledButton>
  );
}

const StyledButton = /* @__PURE__ */ styled(Button)((props) => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
    },
    background: "transparent",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: spacing.sm,
    justifyContent: "space-between",
    padding: spacing.sm,
    paddingRight: spacing.xs,
    transition: "background 200ms ease, transform 150ms ease",
    ...props.style,
  };
});
