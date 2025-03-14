"use client";
import type { Chain } from "../../../../../chains/types.js";
import { type Theme, fontSize } from "../../../../core/design-system/index.js";
import { useChainSymbol } from "../../../../core/hooks/others/useChainQuery.js";
import {
  type ERC20OrNativeToken,
  isNativeToken,
} from "../../ConnectWallet/screens/nativeToken.js";
import { Skeleton } from "../Skeleton.js";
import { Text } from "../text.js";

/**
 * @internal
 */
export function TokenSymbol(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  size: "xs" | "sm" | "md" | "lg";
  color?: keyof Theme["colors"];
  inline?: boolean;
}) {
  if (!isNativeToken(props.token)) {
    return (
      <Text
        size={props.size}
        color={props.color || "primaryText"}
        inline={props.inline}
      >
        {props.token.symbol}
      </Text>
    );
  }

  return (
    <NativeTokenSymbol
      chain={props.chain}
      size={props.size}
      color={props.color}
      inline={props.inline}
    />
  );
}

function NativeTokenSymbol(props: {
  chain: Chain;
  size: "xs" | "sm" | "md" | "lg";
  color?: keyof Theme["colors"];
  inline?: boolean;
}) {
  const chainSymbolQuery = useChainSymbol(props.chain);

  if (chainSymbolQuery.isLoading) {
    return <Skeleton width="70px" height={fontSize[props.size]} />;
  }

  return (
    <Text
      size={props.size}
      color={props.color || "primaryText"}
      inline={props.inline}
    >
      {chainSymbolQuery.symbol ?? "ETH"}
    </Text>
  );
}
