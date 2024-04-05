import { iconSize } from "../design-system";
import { genericTokenIcon } from "../wallet/ConnectWallet/icons/dataUris";
import {
  isNativeToken,
  type ERC20OrNativeToken,
  type NativeToken,
} from "../wallet/ConnectWallet/nativeToken";
import { useChainQuery } from "../wallet/hooks/useChainQuery";
import { Img } from "./Img";

/**
 * @internal
 */
export function TokenIcon(props: {
  token: ERC20OrNativeToken;
  chainId: number;
  size: keyof typeof iconSize;
}) {
  const token = props.token;

  if (isNativeToken(token)) {
    return (
      <NativeTokenIcon
        chainId={props.chainId}
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
  chainId: number;
  nativeToken: NativeToken;
  size: keyof typeof iconSize;
}) {
  const chainQuery = useChainQuery(props.chainId);

  return (
    <Img
      src={chainQuery.data?.icon?.url}
      width={iconSize[props.size]}
      height={iconSize[props.size]}
      fallbackImage={genericTokenIcon}
    />
  );
}
