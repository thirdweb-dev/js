import { isProd } from "@/constants/env-utils";

export async function fetchTokenInfoFromBridge(params: {
  chainId: number;
  tokenAddress: string;
  clientId: string;
}) {
  try {
    const res = await fetch(
      `https://bridge.${isProd ? "thirdweb.com" : "thirdweb-dev.com"}/v1/tokens?chainId=${params.chainId}&tokenAddress=${params.tokenAddress}&clientId=${params.clientId}`,
    );

    if (!res.ok) {
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
