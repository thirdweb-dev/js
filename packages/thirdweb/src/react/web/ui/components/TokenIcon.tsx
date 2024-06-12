"use client";
import { useMemo } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainQuery } from "../../../core/hooks/others/useChainQuery.js";
import { genericTokenIcon } from "../ConnectWallet/icons/dataUris.js";
import {
  type NativeToken,
  isNativeToken,
} from "../ConnectWallet/screens/nativeToken.js";
import { Img } from "./Img.js";

// Note: Must not use useConnectUI here

/**
 * @internal
 */
export function TokenIcon(props: {
  token:
    | {
        address: string;
        icon?: string;
      }
    | NativeToken;
  chain: Chain;
  size: keyof typeof iconSize;
  client: ThirdwebClient;
}) {
  const chainQuery = useChainQuery(props.chain);

  const tokenImage = useMemo(() => {
    if (
      isNativeToken(props.token) ||
      props.token.address === NATIVE_TOKEN_ADDRESS
    ) {
      return chainQuery.data?.icon?.url;
    }
    return props.token.icon;
  }, [props.token, chainQuery.data]);

  return (
    <Img
      src={tokenImage || ""}
      width={iconSize[props.size]}
      height={iconSize[props.size]}
      fallbackImage={genericTokenIcon}
      client={props.client}
    />
  );
}
