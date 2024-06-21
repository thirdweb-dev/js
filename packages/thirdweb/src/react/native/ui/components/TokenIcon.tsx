"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { TokenInfo } from "../../../core/utils/defaultTokens.js";
import { genericTokenIcon } from "../../../core/utils/socialIcons.js";
import { ChainIcon } from "./ChainIcon.js";
import { RNImage } from "./RNImage.js";

// Note: Must not use useConnectUI here

/**
 * @internal
 */
export function TokenIcon(props: {
  token?: TokenInfo;
  chain?: Chain;
  size: number;
  client: ThirdwebClient;
}) {
  return props.token ? (
    <RNImage data={props.token?.icon || genericTokenIcon} size={props.size} />
  ) : (
    <ChainIcon {...props} />
  );
}
