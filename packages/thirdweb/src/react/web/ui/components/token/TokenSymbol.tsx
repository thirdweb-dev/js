import type { Chain } from "../../../../../chains/types.js";
import { useChainQuery } from "../../../../core/hooks/others/useChainQuery.js";
import {
  type ERC20OrNativeToken,
  isNativeToken,
} from "../../ConnectWallet/screens/nativeToken.js";
import { type Theme, fontSize } from "../../design-system/index.js";
import { Skeleton } from "../Skeleton.js";
import { Text } from "../text.js";

/**
 * @internal
 */
export function TokenSymbol(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  size: "sm" | "md" | "lg";
  color?: keyof Theme["colors"];
}) {
  if (!isNativeToken(props.token)) {
    return (
      <Text size={props.size} color={props.color || "primaryText"}>
        {props.token.symbol}
      </Text>
    );
  }

  return (
    <NativeTokenSymbol
      chain={props.chain}
      size={props.size}
      color={props.color}
    />
  );
}

function NativeTokenSymbol(props: {
  chain: Chain;
  size: "sm" | "md" | "lg";
  color?: keyof Theme["colors"];
}) {
  const chainQuery = useChainQuery(props.chain);
  const data = chainQuery.data;

  if (!data) {
    return <Skeleton width="70px" height={fontSize[props.size]} />;
  }

  return (
    <Text size={props.size} color={props.color || "primaryText"}>
      {data.nativeCurrency.symbol}
    </Text>
  );
}
