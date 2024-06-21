import type { Chain } from "../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../client/client.js";
import type { iconSize } from "../../../../../core/design-system/index.js";
import { TokenIcon } from "../../../components/TokenIcon.js";
import { type NativeToken, isNativeToken } from "../nativeToken.js";
import { useBuySupportedDestinations } from "./swap/useSwapSupportedChains.js";

// This is a temporary solution to get the token icon working for ERC20 tokens
// TODO: The proper solutioon is to include the token icon in the quotes / status response objects, currently it is missing.

export function PayTokenIcon(props: {
  token:
    | {
        address: string;
        icon?: string;
      }
    | NativeToken;
  chain: Chain;
  client: ThirdwebClient;
  size: keyof typeof iconSize;
}) {
  const supportedDestinationsQuery = useBuySupportedDestinations(props.client);
  const token = props.token;
  const tokenIcon = !isNativeToken(token)
    ? supportedDestinationsQuery.data
        ?.find((c) => c.chain.id === props.chain.id)
        ?.tokens.find((t) => t.address === token.address)?.icon
    : undefined;

  return (
    <TokenIcon
      token={
        isNativeToken(token)
          ? { nativeToken: true }
          : {
              address: token.address,
              icon: token.icon || tokenIcon,
            }
      }
      chain={props.chain}
      client={props.client}
      size={props.size}
    />
  );
}
