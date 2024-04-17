import { useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { getFiatCurrenciesEndpoint } from "../../../../../../../pay/buyWithCrypto/utils/definitions.js";
import { getClientFetch } from "../../../../../../../utils/fetch.js";

// THIS IS NOT WORKING
// TODO: add types

/**
 * @internal
 */
export function useBuyWithFiatSupportedCurrencies(client: ThirdwebClient) {
  return useQuery({
    queryKey: ["fiat-supported-currencies", client],
    queryFn: async () => {
      const fetchWithHeaders = getClientFetch(client);
      const res = await fetchWithHeaders(getFiatCurrenciesEndpoint());
      const data = await res.json();
      return data;
    },
  });
}
