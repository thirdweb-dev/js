"use client";
import { useMemo } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainMetadata } from "../../../core/hooks/others/useChainQuery.js";
import { genericTokenIcon } from "../../../core/utils/walletIcon.js";
import { CoinsIcon } from "../ConnectWallet/icons/CoinsIcon.js";
import {
  isNativeToken,
  type NativeToken,
} from "../ConnectWallet/screens/nativeToken.js";
import { Container } from "./basic.js";
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
  const chainMeta = useChainMetadata(props.chain).data;

  const tokenImage = useMemo(() => {
    if (
      isNativeToken(props.token) ||
      props.token.address === NATIVE_TOKEN_ADDRESS
    ) {
      if (chainMeta?.nativeCurrency.symbol === "ETH") {
        return "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png"; // ETH icon
      }
      return chainMeta?.icon?.url;
    }
    return props.token.icon;
  }, [props.token, chainMeta?.icon?.url, chainMeta?.nativeCurrency.symbol]);

  return tokenImage ? (
    <Img
      client={props.client}
      fallbackImage={genericTokenIcon}
      height={iconSize[props.size]}
      src={tokenImage}
      width={iconSize[props.size]}
    />
  ) : (
    <Container
      center="both"
      color="secondaryText"
      style={{ height: iconSize[props.size], width: iconSize[props.size] }}
    >
      <CoinsIcon size={iconSize[props.size]} />
    </Container>
  );
}
