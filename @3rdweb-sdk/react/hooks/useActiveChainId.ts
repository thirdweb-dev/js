import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { useSingleQueryParam } from "hooks/useQueryParam";
import {
  SupportedNetwork,
  getChainIdFromNetwork,
  getNetworkFromChainId,
} from "utils/network";

export function useActiveChainId(): SUPPORTED_CHAIN_ID | undefined {
  const networkFromUrl =
    useSingleQueryParam<SupportedNetwork>("networkOrAddress");
  return getChainIdFromNetwork(networkFromUrl);
}

export function useActiveNetwork(): SupportedNetwork | undefined {
  const activeChainId = useActiveChainId();
  return activeChainId && getNetworkFromChainId(activeChainId);
}
