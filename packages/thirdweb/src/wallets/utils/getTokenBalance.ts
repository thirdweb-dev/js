import {
  getWalletBalance as apiGetWalletBalance,
  configure,
} from "@thirdweb-dev/api";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { Account } from "../interfaces/wallet.js";

type GetTokenBalanceOptions = {
  account: Pick<Account, "address">;
  client: ThirdwebClient;
  chain: Chain;
  /**
   * (Optional) The address of the token to retrieve the balance for. If not provided, the balance of the native token will be retrieved.
   */
  tokenAddress?: string;
};

type GetTokenBalanceResult = {
  value: bigint;
  decimals: number;
  displayValue: string;
  symbol: string;
  name: string;
};

/**
 * Retrieves the balance of a token for a given wallet.
 * @param options - The options for retrieving the token balance.
 * @returns A promise that resolves to the token balance result.
 * @example
 * ```ts
 * import { getTokenBalance } from "thirdweb/wallets";
 * const balance = await getTokenBalance({ account, client, chain, tokenAddress });
 * ```
 */
export async function getTokenBalance(
  options: GetTokenBalanceOptions,
): Promise<GetTokenBalanceResult> {
  const { account, client, chain, tokenAddress } = options;

  // Configure the API client with credentials from the thirdweb client
  configure({
    clientId: client.clientId,
    secretKey: client.secretKey,
  });

  const response = await apiGetWalletBalance({
    path: {
      address: account.address,
    },
    query: {
      chainId: [chain.id],
      ...(tokenAddress && { tokenAddress }),
    },
  });

  if (!response.data?.result || response.data.result.length === 0) {
    throw new Error("No balance data returned from API");
  }

  // Get the first result (should match our chain)
  const balanceData = response.data.result[0];

  if (!balanceData) {
    throw new Error("Balance data not found for the specified chain");
  }

  // Transform API response to match the existing GetTokenBalanceResult interface
  return {
    decimals: balanceData.decimals,
    displayValue: balanceData.displayValue,
    name: balanceData.name,
    symbol: balanceData.symbol,
    value: BigInt(balanceData.value),
  };
}
