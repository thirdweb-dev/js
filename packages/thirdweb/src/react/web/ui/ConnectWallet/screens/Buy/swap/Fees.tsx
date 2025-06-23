import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithFiatQuote } from "../../../../../../../pay/buyWithFiat/getQuote.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { Container, Line } from "../../../../components/basic.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Text } from "../../../../components/text.js";

/**
 * @internal
 */
export function SwapFees(props: { quote: BuyWithCryptoQuote }) {
  return (
    <Container
      flex="column"
      gap="xs"
      style={{
        alignItems: "flex-start",
      }}
    >
      {props.quote.processingFees.map((fee) => {
        const feeAmount = formatNumber(Number(fee.amount), 6);
        return (
          <Container
            flex="row"
            gap="xxs"
            key={`${fee.token.chainId}_${fee.token.tokenAddress}_${feeAmount}`}
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
export function FiatFees(props: { quote: BuyWithFiatQuote }) {
  return (
    <Container flex="column" gap="xs">
      {/* Amount ( without fees included ) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text color="secondaryText" inline>
          Amount
        </Text>
        <Text color="primaryText" inline>
          {formatNumber(Number(props.quote.fromCurrency.amount), 2)}{" "}
          {props.quote.fromCurrency.currencySymbol}
        </Text>
      </div>

      {/* Processing Fees */}
      {props.quote.processingFees.map((fee, i) => {
        const feeAmount = formatNumber(Number(fee.amount), 6);

        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: index is ok
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text color="secondaryText" inline>
              {fee.feeType === "NETWORK" ? "Network Fee" : "Processing Fee"}
            </Text>

            <Text color="primaryText" inline>
              {feeAmount === 0 ? "~" : ""} {feeAmount} {fee.currencySymbol}
            </Text>
          </div>
        );
      })}

      <Spacer y="xxs" />
      <Line />
      <Spacer y="xxs" />

      {/* Total Amount  */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text color="secondaryText" inline>
          Total
        </Text>
        <Text color="primaryText" inline>
          {formatNumber(Number(props.quote.fromCurrencyWithFees.amount), 6)}{" "}
          {props.quote.fromCurrencyWithFees.currencySymbol}
        </Text>
      </div>
    </Container>
  );
}
