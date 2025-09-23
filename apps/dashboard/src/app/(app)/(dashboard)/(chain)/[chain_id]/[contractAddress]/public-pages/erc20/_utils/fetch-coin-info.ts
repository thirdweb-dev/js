import "server-only";
import { Bridge, type ThirdwebClient } from "thirdweb";

export async function fetchTokenInfoFromBridge(params: {
  chainId: number;
  tokenAddress: string;
  client: ThirdwebClient;
}) {
  try {
    const res = await Bridge.tokens({
      client: params.client,
      chainId: params.chainId,
      tokenAddress: params.tokenAddress,
      includePrices: true,
      limit: 1,
    });
    return res[0];
  } catch {
    return undefined;
  }
}
