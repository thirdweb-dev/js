import type { BuyWithCryptoQuote } from "@thirdweb-dev/sdk";
import { Container } from "../../../../../components/basic";
import { formatNumber } from "../../../../utils/formatNumber";
import { Text } from "../../../../../components/text";

/**
 * @internal
 */
export function SwapFees(props: {
  quote: BuyWithCryptoQuote;
  align: "left" | "right";
}) {
  return (
    <Container
      flex="column"
      gap="xs"
      style={{
        alignItems: props.align === "right" ? "flex-end" : "flex-start",
      }}
    >
      {/* TODO: why are the explicit annotations required here? */}
      {props.quote.processingFees.map((fee: BuyWithCryptoQuote['processingFees'][number], i: number) => {
        const feeAmount = formatNumber(Number(fee.amount), 4);
        return (
          <Container key={i} flex="row" gap="xxs">
            <Text color="primaryText" size="sm">
              {feeAmount === 0 ? "~" : ""}
              {feeAmount} {fee.token.symbol}
            </Text>
            <Text color="secondaryText" size="sm">
              (${fee.amountUSDCents / 100})
            </Text>
          </Container>
        );
      })}
    </Container>
  );
}
