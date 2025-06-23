import "server-only";
import type { Address } from "thirdweb";
import type { Erc721Token } from "@/types/Erc721Token";
import { chainIdToName, nameToChainId } from "@/util/simplehash";

type GetErc721TokensParams = {
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
}: GetErc721TokensParams): Promise<{
  nextCursor?: string;
  tokens: Erc721Token[];
}> {
  const chainlist = chainIds
    .map((id) => {
      try {
        return `${chainIdToName(id)},`;
      } catch {
        // Ignore unsupported chains when fetching assets
      }
    })
    .join("")
    .slice(0, -1); // remove trailing comma

  const queryParams = new URLSearchParams({
    chains: chainlist,
    filters: "spam_score__lte=80",
    limit: limit.toString(),
    order_by: "floor_price__desc",
    wallet_addresses: owner,
  });

  if (cursor) {
    queryParams.append("cursor", cursor);
  }

  const options = {
    headers: {
      accept: "application/json",
      "X-API-KEY": process.env.SIMPLEHASH_API_KEY as string,
    },
    method: "GET",
    next: {
      cache: "no-store",
      tags: chainIds.map((id) => `transactions-${id}-${owner}`),
    },
  };

  const response = await fetch(
    `https://api.simplehash.com/api/v0/nfts/owners_v2?${decodeURIComponent(queryParams.toString())}`,
    options,
  );

  if (!response.ok) {
    const error = await response.text().catch(() => null);
    console.error(
      `Failed to fetch NFTs: ${response.status} - ${response.statusText}: ${error || "unknown error"}`,
    );
    return {
      nextCursor: undefined,
      tokens: [],
    };
  }
  const data = await response.json();

  return {
    nextCursor: data.next_cursor,
    tokens: data.nfts
      .filter(
        // biome-ignore lint/suspicious/noExplicitAny: false
        (nft: any) => nft.contract.type === "ERC721",
      )
      // biome-ignore lint/suspicious/noExplicitAny: false
      .map((token: any) => ({
        chainId: nameToChainId(token.chain),
        collection: token.collection,
        contract: token.contract,
        contractAddress: token.contract_address,
        description: token.description,
        image_url: token.image_url,
        name: token.name,
        tokenId: Number(token.token_id),
      })),
  };
}
