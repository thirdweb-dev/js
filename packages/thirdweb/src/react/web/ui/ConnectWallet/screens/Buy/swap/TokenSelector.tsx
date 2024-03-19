import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { iconSize } from "../../../../design-system/index.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { Text } from "../../../../components/text.js";
import { TokenIcon } from "../../../../components/TokenIcon.js";
import type { Chain } from "../../../../../../../chains/types.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";

/**
 * @internal
 */
export function TokenSelectorButton(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <Button
      variant="outline"
      style={props.style}
      gap="xxs"
      onClick={props.onClick}
    >
      {props.token ? (
        <>
          <Container flex="row" center="y" gap="xs">
            <TokenIcon token={props.token} chain={props.chain} size="sm" />
            <TokenSymbol token={props.token} chain={props.chain} size="sm" />
          </Container>
          <Container color="secondaryText" flex="row" center="both">
            <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
          </Container>
        </>
      ) : (
        <Container flex="row" center="y" gap="xs" color="secondaryText">
          <Text size="sm"> Select token </Text>
          <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
        </Container>
      )}
    </Button>
  );
}
