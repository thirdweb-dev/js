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
import { Skeleton } from "../../../components/Skeleton.js";
import { Container } from "../../../components/basic.js";
import { Button } from "../../../components/buttons.js";
import { Text } from "../../../components/text.js";
import type { CurrencyMeta } from "./fiat/currencies.js";

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
        borderRadius: radius.md,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderWidth: "1px",
        borderStyle: "solid",
        borderBottom: "none",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left */}
      <CurrencyButton
        variant="ghost"
        onClick={props.onSelectCurrency}
        style={{
          minHeight: "64px",
          justifyContent: "flex-start",
          minWidth: "50%",
        }}
        gap="sm"
      >
        <props.currency.icon size={iconSize.md} />
        <Container flex="row" center="y" gap="xxs" color="secondaryText">
          <Text color="primaryText">{props.currency.shorthand}</Text>
          <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
        </Container>
      </CurrencyButton>

      {/* Right */}
      <div
        style={{
          flexGrow: 1,
          flexShrink: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: spacing.xxs,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          justifyContent: "center",
          paddingRight: spacing.sm,
        }}
      >
        {props.isLoading ? (
          <Skeleton width="100px" height={fontSize.lg} />
        ) : (
          <Text size="lg" color={props.value ? "primaryText" : "secondaryText"}>
            {props.value ? `${formatNumber(Number(props.value), 4)}` : "--"}
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
