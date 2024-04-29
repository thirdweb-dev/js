import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { useChainQuery } from "../../../core/hooks/others/useChainQuery.js";
import { genericTokenIcon } from "../ConnectWallet/icons/dataUris.js";
import {
  type ERC20OrNativeToken,
  isNativeToken,
} from "../ConnectWallet/screens/nativeToken.js";
import { iconSize } from "../design-system/index.js";
import { Img } from "./Img.js";

// Note: Must not use useConnectUI here

/**
 * @internal
 */
export function TokenIcon(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  size: keyof typeof iconSize;
  client: ThirdwebClient;
}) {
  const chainQuery = useChainQuery(props.chain);

  return (
    <Img
      src={
        (isNativeToken(props.token) ? undefined : props.token.icon) ||
        chainQuery.data?.icon?.url
      }
      width={iconSize[props.size]}
      height={iconSize[props.size]}
      fallbackImage={genericTokenIcon}
      client={props.client}
    />
  );
}
