import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { fontSize } from "../../../core/design-system/index.js";
import { useChainName } from "../../../core/hooks/others/useChainQuery.js";
import { Skeleton } from "./Skeleton.js";
import { Text } from "./text.js";

/**
 * @internal
 */
export const ChainName: React.FC<{
  chain: Chain;
  size: "xs" | "sm" | "md" | "lg";
  color?: "primaryText" | "secondaryText";
  client: ThirdwebClient;
  short?: boolean;
  style?: React.CSSProperties;
}> = (props) => {
  const { name } = useChainName(props.chain);

  if (name) {
    return (
      <Text color={props.color} size={props.size} style={props.style}>
        {props.short ? shorterChainName(name) : name}
      </Text>
    );
  }

  return <Skeleton height={fontSize[props.size]} width="50px" />;
};

export function shorterChainName(name: string) {
  const split = name.split(" ");
  const wordsToRemove = new Set(["mainnet", "testnet", "chain"]);
  return split
    .filter((s) => {
      return !wordsToRemove.has(s.toLowerCase());
    })
    .join(" ");
}
