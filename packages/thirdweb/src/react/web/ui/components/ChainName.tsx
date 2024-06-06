import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { fontSize } from "../../../core/design-system/index.js";
import { useChainQuery } from "../../../core/hooks/others/useChainQuery.js";
import { Skeleton } from "./Skeleton.js";
import { Text } from "./text.js";

/**
 * @internal
 */
export const ChainName: React.FC<{
  chain: Chain;
  size: "xs" | "sm" | "md" | "lg";
  client: ThirdwebClient;
}> = (props) => {
  const chainQuery = useChainQuery(props.chain);

  if (chainQuery.data) {
    return <Text size={props.size}>{chainQuery.data.name}</Text>;
  }

  return <Skeleton width={"50px"} height={fontSize[props.size]} />;
};
