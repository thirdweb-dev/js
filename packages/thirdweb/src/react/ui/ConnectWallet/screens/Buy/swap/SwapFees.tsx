import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { SwapQuote } from "../../../../../../pay/swap/actions/getSwap.js";
import { DynamicHeight } from "../../../../components/DynamicHeight.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { iconSize } from "../../../../design-system/index.js";
import { Text } from "../../../../components/text.js";

/**
 * @internal
 */
export function SwapFees(props: { quote: SwapQuote }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Spacer y="lg" />
      <Button
        variant="outline"
        gap="xs"
        fullWidth
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          border: "none",
          justifyContent: "space-between",
          padding: 0,
        }}
      >
        Breakdown
        <Container color="secondaryText" flex="row" center="both">
          <ChevronDownIcon
            width={iconSize.sm}
            height={iconSize.sm}
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </Container>
      </Button>

      <DynamicHeight>
        {isExpanded && (
          <div>
            <Spacer y="sm" />
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
              <Container flex="column" gap="xxs">
                {props.quote.swapFees.map((fee) => {
                  return (
                    <Container
                      key={fee.token.symbol}
                      flex="row"
                      center="y"
                      gap="xxs"
                    >
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
            <Spacer y="sm" />
          </div>
        )}
      </DynamicHeight>
    </div>
  );
}
