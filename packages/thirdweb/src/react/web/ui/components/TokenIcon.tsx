"use client";
import { useMemo } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainIconUrl } from "../../../core/hooks/others/useChainQuery.js";
import { genericTokenIcon } from "../../../core/utils/walletIcon.js";
import {
  type NativeToken,
  isNativeToken,
} from "../ConnectWallet/screens/nativeToken.js";
import { Img } from "./Img.js";

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
  const chainIconQuery = useChainIconUrl(props.chain);

  const tokenImage = useMemo(() => {
    if (
      isNativeToken(props.token) ||
      props.token.address === NATIVE_TOKEN_ADDRESS
    ) {
      return chainIconQuery.url;
    }
    return props.token.icon;
  }, [props.token, chainIconQuery.url]);

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
