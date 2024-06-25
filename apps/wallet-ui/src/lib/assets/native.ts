import type { Address } from "thirdweb";
import { chainIdToName } from "../../util/simplehash";

export type NativeBalancesQueryParams = {
  address: Address;
  chainIds: number[];
  limit?: number;
  cursor?: string;
};

export async function getNativeBalances({
  address,
  chainIds,
}: NativeBalancesQueryParams) {
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
    wallet_addresses: address,
    chains: chainlist,
  });

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": process.env.SIMPLEHASH_API_KEY as string,
    },
  };

  const response = await fetch(
    `https://api.simplehash.com/api/v0/native_tokens/balances?${decodeURIComponent(queryParams.toString())}`,
    options,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch native balances: ${response.text}`);
  }

  return await response.json();
}
