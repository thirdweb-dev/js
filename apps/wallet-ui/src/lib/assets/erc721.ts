import type { Erc721 } from "@/types/erc721";
import { chainIdToName, nameToChainId } from "@/util/simplehash";
import type { Address } from "thirdweb";

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
}: Erc721QueryParams): Promise<{ nextCursor?: string; tokens: Erc721[] }> {
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

  const data = await response.json();

  return {
    nextCursor: data.next_cursor,
    tokens: data.nfts
      .filter((nft) => nft.image_url && nft.description)
      .map((token: unknown) => ({
        chainName: token.chain,
        chainId: nameToChainId(token.chain),
        contractAddress: token.contract_address,
        tokenId: Number(token.token_id),
        name: token.name,
        description: token.description,
        image_url: token.image_url,
      })),
  };
}
