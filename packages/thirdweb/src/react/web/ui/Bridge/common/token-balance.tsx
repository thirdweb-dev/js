import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { getAddress } from "../../../../../utils/address.js";
import { useWalletBalance } from "../../../../core/hooks/others/useWalletBalance.js";

export function useTokenBalance(props: {
  chainId: number | undefined;
  tokenAddress: string | undefined;
  client: ThirdwebClient;
  walletAddress: string | undefined;
}) {
  return useWalletBalance({
    address: props.walletAddress,
    chain: props.chainId ? defineChain(props.chainId) : undefined,
    client: props.client,
    tokenAddress: props.tokenAddress
      ? getAddress(props.tokenAddress) === getAddress(NATIVE_TOKEN_ADDRESS)
        ? undefined
        : getAddress(props.tokenAddress)
      : undefined,
  });
}
