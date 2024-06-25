import type { Address } from "thirdweb";
import { chainIdToName } from "../../util/simplehash";

export type Erc721QueryParams = {
  owner: Address;
  chainIds: number[];
  limit?: number;
  cursor?: string;
};

export async function getErc721Tokens({
  owner,
  chainIds,
  limit = 50,
  cursor,
}: Erc721QueryParams) {
  const chainlist = chainIds
    .map((id) => {
      try {
        return `${chainIdToName(id)},`;
      } catch (e) {
        // Ignore unsupported chains when fetching assets
      }
    })
    .join("")
    .slice(0, -1); // remove trailing comma

  const queryParams = new URLSearchParams({
    wallet_addresses: owner,
    limit: limit.toString(),
    chains: chainlist,
  });

  if (cursor) {
    queryParams.append("cursor", cursor);
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": process.env.SIMPLEHASH_API_KEY as string,
    },
  };

  const response = await fetch(
    `https://api.simplehash.com/api/v0/nfts/owners_v2?${decodeURIComponent(queryParams.toString())}`,
    options,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ERC721s: ${response.statusText}`);
  }

  return await response.json();
}
