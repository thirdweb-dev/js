"use client";
import type { Chain } from "../../../../../chains/types.js";
import { fontSize, type Theme } from "../../../../core/design-system/index.js";
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
        color={props.color || "primaryText"}
        inline={props.inline}
        size={props.size}
      >
        {props.token.symbol}
      </Text>
    );
  }

  return (
    <NativeTokenSymbol
      chain={props.chain}
      color={props.color}
      inline={props.inline}
      size={props.size}
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
    return <Skeleton height={fontSize[props.size]} width="70px" />;
  }

  return (
    <Text
      color={props.color || "primaryText"}
      inline={props.inline}
      size={props.size}
    >
      {chainSymbolQuery.symbol ?? "ETH"}
    </Text>
  );
}
