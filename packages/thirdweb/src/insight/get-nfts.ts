import {
  type GetV1NftsBalanceByOwnerAddressData,
  type GetV1NftsBalanceByOwnerAddressResponse,
  getV1NftsBalanceByOwnerAddress,
} from "@thirdweb-dev/insight";
import { stringify } from "viem";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebDomains } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";

export type OwnedNFT = GetV1NftsBalanceByOwnerAddressResponse["data"][number];

/**
 * Get NFTs owned by an address
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const nfts = await Insight.getOwnedNFTs({
 *   client,
 *   chains: [sepolia],
 *   ownerAddress: "0x1234567890123456789012345678901234567890",
 * });
 * ```
 * @insight
 */
export async function getOwnedNFTs(args: {
  client: ThirdwebClient;
  chains: Chain[];
  ownerAddress: string;
  queryOptions?: GetV1NftsBalanceByOwnerAddressData["query"];
}): Promise<OwnedNFT[]> {
  const {
    client,
    chains,
    ownerAddress,
    queryOptions = {
      chain: chains.map((chain) => chain.id),
      metadata: "true",
      limit: 100,
      page: 1,
    },
  } = args;

  const result = await getV1NftsBalanceByOwnerAddress({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
    path: {
      ownerAddress: ownerAddress,
    },
    query: {
      chain: chains.map((chain) => chain.id),
      ...queryOptions,
    },
  });

  if (result.error) {
    throw new Error(
      `${result.response.status} ${result.response.statusText} - ${result.error ? stringify(result.error) : "Unknown error"}`,
    );
  }

  return result.data?.data ?? [];
}
