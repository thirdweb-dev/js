import {
  type GetV1WalletsByWalletAddressTransactionsData,
  type GetV1WalletsByWalletAddressTransactionsResponse,
  getV1WalletsByWalletAddressTransactions,
} from "@thirdweb-dev/insight";
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
  queryOptions?: Omit<
    GetV1WalletsByWalletAddressTransactionsData["query"],
    "chain"
  >;
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
      ...queryOptions,
      chain: chains.map((chain) => chain.id),
    },
    path: {
      wallet_address: walletAddress,
    },
  });
  if (result.error) {
    throw new Error(result.error.error);
  }
  return result.data.data || [];
}
