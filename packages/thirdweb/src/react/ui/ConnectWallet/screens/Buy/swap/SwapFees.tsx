import type { SwapQuote } from "../../../../../../pay/swap/actions/getSwap.js";
import { formatNumber } from "../../../../../utils/formatNumber.js";
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
              <Text color="primaryText" size="sm">
                {formatNumber(Number(fee.amount), 4)} {fee.token.symbol}
              </Text>
              <Text color="secondaryText" size="sm">
                (${fee.amountUSDCents / 100})
              </Text>
            </Container>
          );
        })}
      </Container>
    </Container>
  );
}
