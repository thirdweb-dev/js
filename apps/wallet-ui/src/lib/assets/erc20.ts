import type { Erc20Token } from "@/types/Erc20Token";
import { chainIdToName, nameToChainId } from "@/util/simplehash";
import type { Address } from "thirdweb";

export type GetErc20TokensParams = {
  owner: Address;
  chainIds: number[];
  limit?: number;
  cursor?: string;
};

export async function getErc20Tokens({
  owner,
  chainIds,
  limit = 50,
  cursor,
}: GetErc20TokensParams): Promise<{
  nextCursor?: string;
  tokens: Erc20Token[];
}> {
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
    `https://api.simplehash.com/api/v0/fungibles/balances?${decodeURIComponent(queryParams.toString())}`,
    options,
  );

  if (!response.ok) {
    response.body?.cancel();
    throw new Error("Failed to fetch ERC20tokens");
  }

  const data = await response.json();

  return {
    nextCursor: data.next_cursor,
    // biome-ignore lint/suspicious/noExplicitAny: false
    tokens: data.fungibles.map((token: any) => ({
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      chainId: nameToChainId(token.chain),
    })),
  };
}
