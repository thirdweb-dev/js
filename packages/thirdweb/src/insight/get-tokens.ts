import {
  type GetV1TokensErc20ByOwnerAddressData,
  type GetV1TokensErc20ByOwnerAddressResponse,
  getV1TokensErc20ByOwnerAddress,
} from "@thirdweb-dev/insight";
import { stringify } from "viem";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebDomains } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";

export type OwnedToken = GetV1TokensErc20ByOwnerAddressResponse["data"][number];

/**
 * Get ERC20 tokens owned by an address
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const tokens = await Insight.getOwnedTokens({
 *   client,
 *   chains: [sepolia],
 *   ownerAddress: "0x1234567890123456789012345678901234567890",
 * });
 * ```
 * @insight
 */
export async function getOwnedTokens(args: {
  client: ThirdwebClient;
  chains: Chain[];
  ownerAddress: string;
  queryOptions?: Omit<GetV1TokensErc20ByOwnerAddressData["query"], "chain">;
}): Promise<OwnedToken[]> {
  const {
    client,
    chains,
    ownerAddress,
    queryOptions = {
      chain: chains.map((chain) => chain.id),
      include_spam: "false",
      metadata: "true",
      limit: 100,
      page: 1,
    },
  } = args;

  const result = await getV1TokensErc20ByOwnerAddress({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
    path: {
      ownerAddress: ownerAddress,
    },
    query: {
      ...queryOptions,
      chain: chains.map((chain) => chain.id),
    },
  });

  if (!result.data || result.error) {
    throw new Error(result.error ? stringify(result.error) : "Unknown error");
  }
  return result.data.data;
}
