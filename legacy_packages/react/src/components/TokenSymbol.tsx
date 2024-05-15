import { type Theme, fontSize } from "../design-system";
import {
  isNativeToken,
  type ERC20OrNativeToken,
} from "../wallet/ConnectWallet/nativeToken";
import { useChainQuery } from "../wallet/hooks/useChainQuery";
import { Skeleton } from "./Skeleton";
import { Text } from "./text";

/**
 * @internal
 */
export function TokenSymbol(props: {
  token: ERC20OrNativeToken;
  chainId: number;
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
      chainId={props.chainId}
      size={props.size}
      color={props.color}
    />
  );
}

function NativeTokenSymbol(props: {
  chainId: number;
  size: "sm" | "md" | "lg";
  color?: keyof Theme["colors"];
}) {
  const chainQuery = useChainQuery(props.chainId);
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
