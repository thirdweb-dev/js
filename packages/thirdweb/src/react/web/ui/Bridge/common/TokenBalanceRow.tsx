import styled from "@emotion/styled";
import type { Token } from "../../../../../bridge/index.js";
import { getCachedChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
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
}: {
  client: ThirdwebClient;
  token: Token;
  amount: string;
  onClick: (token: Token) => void;
  style?: React.CSSProperties;
}) {
  const chain = getCachedChain(token.chainId);
  return (
    <StyledButton
      onClick={() => onClick(token)}
      variant="secondary"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: `${spacing.sm} ${spacing.md}`,
        ...style,
      }}
    >
      <TokenAndChain
        token={token}
        client={client}
        size="lg"
        style={{ maxWidth: "50%", flex: 1 }}
      />

      <Container
        flex="row"
        center="y"
        gap="4xs"
        color="secondaryText"
        style={{
          flex: "1",
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
          }}
        >
          <FiatValue
            tokenAmount={amount}
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
    background: "transparent",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    flexDirection: "row",
    padding: spacing.sm,
    paddingRight: spacing.xs,
    gap: spacing.sm,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
    },
    transition: "background 200ms ease, transform 150ms ease",
    ...props.style,
  };
});
