import { isProd } from "@/constants/env";

export async function isAnalyticsSupportedForChain(
  chainId: number,
): Promise<boolean> {
  try {
    if (!process.env.CHAINSAW_API_KEY) {
      throw new Error("Missing CHAINSAW_API_KEY env var");
    }

    const res = await fetch(
      `https://chainsaw.${isProd ? "thirdweb" : "thirdweb-dev"}.com/service/chains/${chainId}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          // pass the shared secret
          "x-service-api-key": process.env.CHAINSAW_API_KEY || "",
        },
      },
    );

    if (!res.ok) {
      // assume not supported if we get a non-200 response
      return false;
    }

    const { data } = await res.json();
    return data;
  } catch (e) {
    console.error("Error checking if analytics is supported for chain", e);
  }

  return false;
}
