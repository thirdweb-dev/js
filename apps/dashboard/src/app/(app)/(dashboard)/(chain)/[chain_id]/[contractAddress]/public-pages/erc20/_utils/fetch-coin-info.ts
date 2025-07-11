import "server-only";
import { isProd } from "@/constants/env-utils";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";

export async function fetchTokenInfoFromBridge(params: {
  chainId: number;
  tokenAddress: string;
  clientId: string;
}) {
  try {
    const res = await fetch(
      `https://bridge.${isProd ? "thirdweb.com" : "thirdweb-dev.com"}/v1/tokens?chainId=${params.chainId}&tokenAddress=${params.tokenAddress}`,
      {
        headers: {
          "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
        },
      },
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch token info from bridge: ${await res.text()}`,
      );
      return null;
    }

    const data = (await res.json()) as {
      data: Array<{
        iconUri: string;
        address: string;
        decimals: number;
        name: string;
        symbol: string;
        priceUsd: number;
      }>;
    };

    return data.data[0];
  } catch {
    return null;
  }
}
