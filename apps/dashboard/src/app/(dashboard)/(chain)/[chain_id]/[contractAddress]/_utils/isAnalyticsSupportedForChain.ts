import { INSIGHT_SERVICE_API_KEY } from "@/constants/env";
import { getVercelEnv } from "lib/vercel-utils";

const thirdwebDomain =
  getVercelEnv() !== "production" ? "thirdweb-dev" : "thirdweb";

export async function isAnalyticsSupportedForChain(
  chainId: number,
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://insight.${thirdwebDomain}.com/service/chains/${chainId}`,
      {
        headers: {
          // service api key required - because this is endpoint is internal
          "x-service-api-key": INSIGHT_SERVICE_API_KEY,
        },
      },
    );

    if (!res.ok) {
      return false;
    }

    const json = (await res.json()) as { data: boolean };

    return json.data;
  } catch (e) {
    console.error(`Error checking analytics support for chain ${chainId}`);
    console.error(e);
  }
  return false;
}
