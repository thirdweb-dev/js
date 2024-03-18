import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/actions/getQuote.js";
import { formatNumber } from "../../../../../../core/utils/formatNumber.js";
import { Container } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";
import { useCustomTheme } from "../../../../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../../../../design-system/elements.js";
import { radius, spacing } from "../../../../design-system/index.js";

/**
 * @internal
 */
export function SwapFees(props: { quote: BuyWithCryptoQuote }) {
  return (
    <Container animate="fadein">
      <FeesContainer>
        <Text color="secondaryText" size="xs">
          Processing Fees
        </Text>
        <Container
          flex="column"
          gap="xxs"
          style={{
            alignItems: "flex-end",
          }}
        >
          {props.quote.processingFees.map((fee) => {
            return (
              <Container key={fee.token.symbol} flex="row" gap="xxs">
                <Text color="primaryText" size="xs">
                  {formatNumber(Number(fee.amount), 4)} {fee.token.symbol}
                </Text>
                <Text color="secondaryText" size="xs">
                  (${fee.amountUSDCents / 100})
                </Text>
              </Container>
            );
          })}
        </Container>
      </FeesContainer>
    </Container>
  );
}

const FeesContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    display: "flex",
    justifyContent: "space-between",
    padding: spacing.sm,
    // backgroundColor: theme.colors.walletSelectorButtonHoverBg,
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.md,
  };
});
