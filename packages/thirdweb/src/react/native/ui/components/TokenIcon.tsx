"use client";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { TokenInfo } from "../../../core/utils/defaultTokens.js";
import { genericTokenIcon } from "../../../core/utils/walletIcon.js";
import { ChainIcon } from "./ChainIcon.js";
import { RNImage } from "./RNImage.js";

/**
 * @internal
 */
export function TokenIcon(props: {
  theme: Theme;
  size: number;
  token?: TokenInfo;
  chain?: Chain;
  client: ThirdwebClient;
}) {
  return props.token ? (
    <RNImage
      data={props.token?.icon || genericTokenIcon}
      size={props.size}
      theme={props.theme}
    />
  ) : (
    <ChainIcon {...props} />
  );
}
