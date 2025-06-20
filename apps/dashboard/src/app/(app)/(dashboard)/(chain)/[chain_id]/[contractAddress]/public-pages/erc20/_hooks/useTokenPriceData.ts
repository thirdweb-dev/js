import { useQuery } from "@tanstack/react-query";
import { isProd } from "@/constants/env-utils";
import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "@/constants/public-envs";

type TokenPriceData = {
  price_usd: number;
  price_usd_cents: number;
  percent_change_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  volume_change_24h: number;
  holders: number;
  historical_prices: Array<{
    date: string;
    price_usd: number;
    price_usd_cents: number;
  }>;
};

export function useTokenPriceData(params: {
  chainId: number;
  contractAddress: string;
}) {
  return useQuery({
    queryFn: async () => {
      const url = new URL(
        `https://insight.${isProd ? "thirdweb" : "thirdweb-dev"}.com/v1/tokens/price`,
      );

      url.searchParams.set("include_historical_prices", "true");
      url.searchParams.set("chain_id", params.chainId.toString());
      url.searchParams.set("address", params.contractAddress);
      url.searchParams.set("include_holders", "true");
      url.searchParams.set("clientId", NEXT_PUBLIC_DASHBOARD_CLIENT_ID);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const json = await res.json();
      const priceData = json.data[0] as TokenPriceData | undefined;
      return priceData
        ? {
            data: priceData,
            type: "data-found" as const,
          }
        : { type: "no-data" as const };
    },
    queryKey: ["token-price-chart", params.chainId, params.contractAddress],
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
  });
}
