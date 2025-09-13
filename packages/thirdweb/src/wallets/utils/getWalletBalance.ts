import {
  getWalletBalance as apiGetWalletBalance,
  configure,
} from "@thirdweb-dev/api";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { GetBalanceResult } from "../../extensions/erc20/read/getBalance.js";

export type GetWalletBalanceOptions = {
  address: string;
  client: ThirdwebClient;
  chain: Chain;
  /**
   * (Optional) The address of the token to retrieve the balance for. If not provided, the balance of the native token will be retrieved.
   */
  tokenAddress?: string;
};

export type GetWalletBalanceResult = GetBalanceResult;

/**
 * Retrieves the balance of a token or native currency for a given wallet.
 * @param options - The options for retrieving the token balance.
 * @param options.address - The address for which to retrieve the balance.
 * @param options.client - The Thirdweb client to use for the request.
 * @param options.chain - The chain for which to retrieve the balance.
 * @param options.tokenAddress - (Optional) The address of the token to retrieve the balance for. If not provided, the balance of the native token will be retrieved.
 * @returns A promise that resolves to the token balance result.
 * @example
 * ```ts
 * import { getWalletBalance } from "thirdweb/wallets";
 * const balance = await getWalletBalance({ address, client, chain, tokenAddress });
 * ```
 * @walletUtils
 */
export async function getWalletBalance(
  options: GetWalletBalanceOptions,
): Promise<GetBalanceResult> {
  const { address, client, chain, tokenAddress } = options;

  // Configure the API client with credentials from the thirdweb client
  configure({
    clientId: client.clientId,
    secretKey: client.secretKey,
  });

  const response = await apiGetWalletBalance({
    path: {
      address,
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

  // Transform API response to match the existing GetBalanceResult interface
  return {
    chainId: balanceData.chainId,
    decimals: balanceData.decimals,
    displayValue: balanceData.displayValue,
    name: balanceData.name,
    symbol: balanceData.symbol,
    tokenAddress: balanceData.tokenAddress,
    value: BigInt(balanceData.value),
  };
}
