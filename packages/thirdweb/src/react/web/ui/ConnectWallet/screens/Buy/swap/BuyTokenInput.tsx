import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { ChainIcon } from "../../../../components/ChainIcon.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Input } from "../../../../components/formElements.js";
import { Text } from "../../../../components/text.js";
import { fontSize, iconSize } from "../../../../design-system/index.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { TokenSelectorButton } from "./TokenSelector.js";

/**
 * @internal
 */
export function BuyTokenInput(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  value: string;
  onChange: (value: string) => void;
  onTokenClick: () => void;
  onChainClick: () => void;
}) {
  const chainQuery = useChainQuery(props.chain);

  return (
    <Container>
      <Input
        variant="outline"
        pattern="^[0-9]*[.,]?[0-9]*$"
        inputMode="decimal"
        placeholder="0"
        type="text"
        data-placeholder={props.value === ""}
        value={props.value || "0"}
        onClick={(e) => {
          // put cursor at the end of the input
          if (props.value === "") {
            e.currentTarget.setSelectionRange(
              e.currentTarget.value.length,
              e.currentTarget.value.length,
            );
          }
        }}
        onChange={(e) => {
          let value = e.target.value;

          if (value.startsWith(".")) {
            value = `0${value}`;
          }

          const numValue = Number(value);
          if (Number.isNaN(numValue)) {
            return;
          }

          if (value.startsWith("0") && !value.startsWith("0.")) {
            props.onChange(value.slice(1));
          } else {
            props.onChange(value);
          }
        }}
        style={{
          border: "none",
          fontSize: "50px",
          boxShadow: "none",
          padding: "0",
          fontWeight: 600,
          textAlign: "center",
        }}
      />

      <Spacer y="md" />

      <Container flex="row" center="x">
        <TokenSelectorButton
          onClick={props.onTokenClick}
          token={props.token}
          chain={props.chain}
          style={{
            padding: 0,
            fontSize: fontSize.sm,
            border: "none",
          }}
        />
      </Container>

      <Spacer y="md" />

      <Container flex="row" center="x">
        <Button
          variant="outline"
          style={{
            fontSize: fontSize.sm,
            padding: 0,
            border: "none",
          }}
          gap="xxs"
          onClick={props.onChainClick}
        >
          <ChainIcon chain={chainQuery.data} size={iconSize.sm} />
          {chainQuery.data?.name ? (
            <Text size="sm">{chainQuery.data.name}</Text>
          ) : (
            <Skeleton width="90px" height={fontSize.xs} />
          )}
          <Container color="secondaryText" flex="row" center="both">
            <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
          </Container>
        </Button>
      </Container>
    </Container>
  );
}
