import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { Container } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";

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
      {props.quote.processingFees.map((fee) => {
        const feeAmount = formatNumber(Number(fee.amount), 4);
        return (
          <Container
            key={`${fee.token.chainId}_${fee.token.tokenAddress}_${feeAmount}`}
            flex="row"
            gap="xxs"
          >
            <Text color="primaryText" size="sm">
              {feeAmount === 0 ? "~" : ""}
              {feeAmount} {fee.token.symbol}
            </Text>
            <Text color="secondaryText" size="sm">
              (${(fee.amountUSDCents / 100).toFixed(2)})
            </Text>
          </Container>
        );
      })}
    </Container>
  );
}

/**
 * @internal
 */
export function FiatFees(props: {
  quote: BuyWithFiatQuote;
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
      {props.quote.processingFees.map((fee, i) => {
        const feeAmount = formatNumber(Number(fee.amount), 4);

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: index is ok
          <div key={i}>
            <Text color="primaryText" inline>
              {feeAmount === 0 ? "~" : ""}
              {feeAmount} {fee.currencySymbol}{" "}
            </Text>
            {fee.feeType === "NETWORK" ? (
              <Text inline color="secondaryText" size="sm">
                (Network Fees)
              </Text>
            ) : null}
          </div>
        );
      })}
    </Container>
  );
}
