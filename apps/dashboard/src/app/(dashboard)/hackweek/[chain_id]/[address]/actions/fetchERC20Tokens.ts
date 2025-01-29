"use server";

import assert from "node:assert";
import type { TokenDetails } from "../hooks/useGetERC20Tokens";

interface SimpleHashResponse {
  fungibles: {
    name: string;
    symbol: string;
    decimals: number;
    total_quantity_string: string;
    total_value_usd_string: string;
  }[];
  next_cursor: string | null;
}

export async function fetchERC20Tokens(args: {
  chainId: number;
  address: string;
}): Promise<TokenDetails[]> {
  try {
    const { SIMPLEHASH_API_KEY } = process.env;
    assert(SIMPLEHASH_API_KEY, "SIMPLEHASH_API_KEY is not set");
    const { chainId, address } = args;

    const response = await fetch(
      `https://api.simplehash.com/api/v0/fungibles/balances?chains=eip155:${chainId}&wallet_addresses=${address}&include_fungible_details=1&include_prices=1&count=0&limit=50&order_by=last_transferred_date__desc&include_native_tokens=0`,
      {
        headers: { "X-API-KEY": SIMPLEHASH_API_KEY },
      },
    );
    if (!response.ok) {
      throw new Error(
        `Unexpected status ${response.status}: ${await response.text()}`,
      );
    }

    const data: SimpleHashResponse = await response.json();
    return data.fungibles.map((token) => ({
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      balance: token.total_quantity_string,
      totalValueUsdString: token.total_value_usd_string,
    }));
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
}
