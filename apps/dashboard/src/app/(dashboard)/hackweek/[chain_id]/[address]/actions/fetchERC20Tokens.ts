"use server";

import assert from "node:assert";
import { toTokens } from "thirdweb";
import type { TokenDetails } from "../hooks/useGetERC20Tokens";

interface QueriedWalletBalance {
  address: string;
  quantity_string: string;
  value_usd_cents: number;
  first_transferred_date: string;
  last_transferred_date: string;
}

interface FungibleToken {
  fungible_id: string;
  name: string;
  symbol: string;
  decimals: number;
  total_quantity_string: string;
  total_value_usd_cents: number;
  queried_wallet_balances: QueriedWalletBalance[];
}

interface NativeToken {
  token_id: string;
  name: string;
  symbol: string;
  decimals: number;
  total_quantity_string: string;
  total_value_usd_cents: number;
  queried_wallet_balances: QueriedWalletBalance[];
}

interface SimpleHashResponse {
  fungibles: FungibleToken[];
  native_tokens: NativeToken[];
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
      `https://api.simplehash.com/api/v0/fungibles/balances?chains=eip155:${chainId}&wallet_addresses=${address}&include_fungible_details=0&include_prices=1&count=0&limit=50&order_by=last_transferred_date__desc&include_native_tokens=1`,
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
    const nativeTokens = data.native_tokens.map((token) => ({
      name: token.name,
      symbol: token.symbol,
      contractAddress: "Native",
      decimals: token.decimals,
      balance: BigInt(token.total_quantity_string ?? 0n),
      balanceTokens: Number(
        toTokens(BigInt(token.total_quantity_string), token.decimals),
      ),
      totalValueUsdCents: token.total_value_usd_cents,
      firstTransferredDate:
        token.queried_wallet_balances[0]?.first_transferred_date,
      lastTransferredDate:
        token.queried_wallet_balances[0]?.last_transferred_date,
    }));
    let fungibleTokens = data.fungibles.map((token) => ({
      name: token.name,
      symbol: token.symbol,
      contractAddress: token.fungible_id.split(".")[1] ?? "--",
      decimals: token.decimals,
      balance: BigInt(token.total_quantity_string ?? 0n),
      balanceTokens: Number(
        toTokens(BigInt(token.total_quantity_string), token.decimals),
      ),
      totalValueUsdCents: token.total_value_usd_cents,
      firstTransferredDate:
        token.queried_wallet_balances[0]?.first_transferred_date,
      lastTransferredDate:
        token.queried_wallet_balances[0]?.last_transferred_date,
    }));
    fungibleTokens = fungibleTokens.filter(d => d.name != null || d.symbol != null);
    return [...nativeTokens, ...fungibleTokens];
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
}
