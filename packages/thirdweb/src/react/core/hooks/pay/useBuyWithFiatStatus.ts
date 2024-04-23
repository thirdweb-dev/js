import { useQuery } from "@tanstack/react-query";
import {
  type GetBuyWithFiatStatusParams,
  getBuyWithFiatStatus,
} from "../../../../pay/buyWithFiat/getStatus.js";

/**
 * TODO
 */
export function useBuyWithFiatStatus(params?: GetBuyWithFiatStatusParams) {
  return useQuery({
    queryKey: ["useBuyWithFiatStatus", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("No params provided");
      }
      return getBuyWithFiatStatus(params);
    },
    enabled: !!params,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    retry: true,
  });
}
