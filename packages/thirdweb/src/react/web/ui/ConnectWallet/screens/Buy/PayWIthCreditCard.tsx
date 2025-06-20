import styled from "@emotion/styled";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import { formatNumber } from "../../../../../../utils/formatNumber.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../../core/design-system/index.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Skeleton } from "../../../components/Skeleton.js";
import { Text } from "../../../components/text.js";
import { type CurrencyMeta, getFiatIcon } from "./fiat/currencies.js";

/**
 * Shows an amount "value" and renders the selected token and chain
 * It also renders the buttons to select the token and chain
 * It also renders the balance of active wallet for the selected token in selected chain
 * @internal
 */
export function PayWithCreditCard(props: {
  value?: string;
  isLoading: boolean;
  client: ThirdwebClient;
  currency: CurrencyMeta;
  onSelectCurrency: () => void;
}) {
  return (
    <Container
      bg="tertiaryBg"
      borderColor="borderColor"
      flex="row"
      style={{
        alignItems: "center",
        borderBottom: "none",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderRadius: radius.md,
        borderStyle: "solid",
        borderWidth: "1px",
        flexWrap: "nowrap",
        justifyContent: "space-between",
      }}
    >
      {/* Left */}
      <CurrencyButton
        gap="sm"
        onClick={props.onSelectCurrency}
        style={{
          justifyContent: "flex-start",
          minHeight: "64px",
          minWidth: "50%",
        }}
        variant="ghost"
      >
        {getFiatIcon(props.currency, "md")}
        <Container center="y" color="secondaryText" flex="row" gap="xxs">
          <Text color="primaryText">{props.currency.shorthand}</Text>
          <ChevronDownIcon height={iconSize.sm} width={iconSize.sm} />
        </Container>
      </CurrencyButton>

      {/* Right */}
      <div
        style={{
          alignItems: "flex-end",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          flexShrink: 1,
          gap: spacing.xxs,
          justifyContent: "center",
          overflow: "hidden",
          paddingRight: spacing.sm,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.isLoading ? (
          <Skeleton height={fontSize.lg} width="100px" />
        ) : (
          <Text color={props.value ? "primaryText" : "secondaryText"} size="lg">
            {props.value
              ? `${props.currency.symbol}${formatNumber(
                  Number(props.value),
                  2,
                )}`
              : "--"}
          </Text>
        )}
      </div>
    </Container>
  );
}

const CurrencyButton = /* @__PURE__ */ styled(Button)(() => {
  return {
    "&[disabled]:hover": {
      borderColor: "transparent",
    },
  };
});
