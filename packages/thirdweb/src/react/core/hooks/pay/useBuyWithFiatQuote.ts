import { useQuery } from "@tanstack/react-query";
import {
  type GetBuyWithFiatQuoteParams,
  getBuyWithFiatQuote,
} from "../../../../pay/buyWithFiat/getQuote.js";

/**
 * TODO
 */
export function useBuyWithFiatQuote(params?: GetBuyWithFiatQuoteParams) {
  return useQuery({
    queryKey: ["useBuyWithFiatQuote", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("No params provided");
      }
      return getBuyWithFiatQuote(params);
    },
    enabled: !!params,
  });
}
