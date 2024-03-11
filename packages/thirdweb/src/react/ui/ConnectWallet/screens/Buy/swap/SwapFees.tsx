import type { SwapQuote } from "../../../../../../pay/swap/actions/getSwap.js";
import { Container } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";

/**
 * @internal
 */
export function SwapFees(props: { quote: SwapQuote }) {
  return (
    <Container
      animate="fadein"
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Container color="secondaryText" flex="row" gap="xxs">
        <Text color="secondaryText" size="sm">
          Processing Fees
        </Text>
      </Container>
      <Container
        flex="column"
        gap="xxs"
        style={{
          alignItems: "flex-end",
        }}
      >
        {props.quote.swapFees.map((fee) => {
          return (
            <Container key={fee.token.symbol} flex="row" center="y" gap="xxs">
              <Text color="primaryText" size="xs">
                {Number(fee.amount).toFixed(3)} {fee.token.symbol}
              </Text>
              <Text color="secondaryText" size="xs">
                (${fee.amountUSDCents / 100})
              </Text>
            </Container>
          );
        })}
      </Container>
    </Container>
  );
}
