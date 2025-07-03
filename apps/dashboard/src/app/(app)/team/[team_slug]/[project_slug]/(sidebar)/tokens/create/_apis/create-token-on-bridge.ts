import type { ThirdwebClient } from "thirdweb";
import { isProd } from "@/constants/env-utils";

export async function createTokenOnUniversalBridge(params: {
  chainId: number;
  tokenAddress: string;
  client: ThirdwebClient;
}) {
  const domain = isProd ? "thirdweb.com" : "thirdweb-dev.com";
  const res = await fetch(
    `https://bridge.${domain}/v1/tokens?chainId=${params.chainId}&tokenAddress=${params.tokenAddress}`,
    {
      headers: {
        "x-client-id": params.client.clientId,
      },
      method: "POST",
    },
  );

  return res;
}
