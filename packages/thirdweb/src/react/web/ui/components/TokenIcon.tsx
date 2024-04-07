import type { Chain } from "../../../../chains/types.js";
import { useChainQuery } from "../../../core/hooks/others/useChainQuery.js";
import { genericTokenIcon } from "../ConnectWallet/icons/dataUris.js";
import {
  type ERC20OrNativeToken,
  type NativeToken,
  isNativeToken,
} from "../ConnectWallet/screens/nativeToken.js";
import { iconSize } from "../design-system/index.js";
import { Img } from "./Img.js";

/**
 * @internal
 */
export function TokenIcon(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  size: keyof typeof iconSize;
}) {
  const token = props.token;

  if (isNativeToken(token)) {
    return (
      <NativeTokenIcon
        chain={props.chain}
        nativeToken={token}
        size={props.size}
      />
    );
  }

  return (
    <Img
      src={token.icon}
      width={iconSize[props.size]}
      height={iconSize[props.size]}
      fallbackImage={genericTokenIcon}
    />
  );
}

function NativeTokenIcon(props: {
  chain: Chain;
  nativeToken: NativeToken;
  size: keyof typeof iconSize;
}) {
  const chainQuery = useChainQuery(props.chain);

  return (
    <Img
      src={chainQuery.data?.icon?.url}
      width={iconSize[props.size]}
      height={iconSize[props.size]}
      fallbackImage={genericTokenIcon}
    />
  );
}
