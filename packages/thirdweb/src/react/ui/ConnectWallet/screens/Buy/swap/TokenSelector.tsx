import { ChevronDownIcon } from "@radix-ui/react-icons";
import { fallbackChainIcon } from "../../../../components/ChainIcon.js";
import { Img } from "../../../../components/Img.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { iconSize, fontSize } from "../../../../design-system/index.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { Text } from "../../../../components/text.js";

/**
 * @internal
 */
export function TokenSelectorButton(props: {
  tokenIcon?: string;
  tokenSymbol?: string;
  token?: ERC20OrNativeToken;
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
            {props.tokenIcon ? (
              <Img
                src={props.tokenIcon}
                width={iconSize.sm}
                height={iconSize.sm}
                fallbackImage={fallbackChainIcon}
              />
            ) : (
              <Skeleton
                width={iconSize.sm + "px"}
                height={iconSize.sm + "px"}
              />
            )}

            {props.tokenSymbol ? (
              <Text color="primaryText" size="sm">
                {props.tokenSymbol}
              </Text>
            ) : (
              <Skeleton width="70px" height={fontSize.sm} />
            )}
          </Container>

          <Container color="secondaryText">
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
