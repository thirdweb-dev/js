import { useQuery } from "@tanstack/react-query";
import { getPayChainsEndpoint } from "../../../../../../../pay/buyWithCrypto/utils/definitions.js";
import { getClientFetch } from "../../../../../../../utils/fetch.js";
import { useThirdwebProviderProps } from "../../../../../../core/hooks/others/useThirdwebProviderProps.js";
import { defineChain } from "../../../../../../../chains/utils.js";

/**
 * @internal
 */
export function useSwapSupportedChains() {
  const { client } = useThirdwebProviderProps();
  return useQuery({
    queryKey: ["swapSupportedChains", client],
    queryFn: async () => {
      const fetchWithHeaders = getClientFetch(client);
      const res = await fetchWithHeaders(getPayChainsEndpoint());
      const data = await res.json();
      const chainIds = data.result.chainIds as number[];
      return chainIds.map(defineChain);
    },
  });
}
