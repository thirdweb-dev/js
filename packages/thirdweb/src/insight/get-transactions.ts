import {
  type GetV1WalletsByWalletAddressTransactionsData,
  type GetV1WalletsByWalletAddressTransactionsResponse,
  getV1WalletsByWalletAddressTransactions,
} from "@thirdweb-dev/insight";
import { stringify } from "viem";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebDomains } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";

export type Transaction = NonNullable<
  GetV1WalletsByWalletAddressTransactionsResponse["data"]
>[number];

/**
 * Get transactions for a wallet
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const transactions = await Insight.getTransactions({
 *   client,
 *   walletAddress: "0x1234567890123456789012345678901234567890",
 *   chains: [sepolia],
 * });
 * ```
 * @insight
 */
export async function getTransactions(args: {
  client: ThirdwebClient;
  walletAddress: string;
  chains: Chain[];
  queryOptions?: GetV1WalletsByWalletAddressTransactionsData["query"];
}): Promise<Transaction[]> {
  const threeMonthsAgoInSeconds = Math.floor(
    (Date.now() - 3 * 30 * 24 * 60 * 60 * 1000) / 1000,
  );
  const {
    client,
    walletAddress,
    chains,
    queryOptions = {
      filter_block_timestamp_gte: threeMonthsAgoInSeconds,
      limit: 100,
      page: 1,
    },
  } = args;
  const result = await getV1WalletsByWalletAddressTransactions({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
    query: {
      chain: chains.map((chain) => chain.id),
      ...queryOptions,
    },
    path: {
      wallet_address: walletAddress,
    },
  });
  if (result.error) {
    throw new Error(
      `${result.response.status} ${result.response.statusText} - ${result.error ? stringify(result.error) : "Unknown error"}`,
    );
  }
  return result.data.data || [];
}
