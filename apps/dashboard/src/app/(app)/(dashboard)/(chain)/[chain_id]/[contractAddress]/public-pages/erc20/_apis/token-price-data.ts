import "server-only";
import { isProd } from "@/constants/env-utils";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";

export type TokenPriceData = {
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

export async function getTokenPriceData(params: {
  chainId: number;
  contractAddress: string;
}) {
  try {
    const url = new URL(
      `https://insight.${isProd ? "thirdweb" : "thirdweb-dev"}.com/v1/tokens/price`,
    );

    url.searchParams.set("include_historical_prices", "true");
    url.searchParams.set("chain_id", params.chainId.toString());
    url.searchParams.set("address", params.contractAddress);
    url.searchParams.set("include_holders", "true");

    const res = await fetch(url, {
      headers: {
        "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
      },
    });
    if (!res.ok) {
      console.error("Failed to fetch token price data", await res.text());
      return undefined;
    }

    const json = await res.json();
    const priceData = json.data[0] as TokenPriceData | undefined;

    return priceData;
  } catch {
    return undefined;
  }
}
