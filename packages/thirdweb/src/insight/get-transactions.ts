import type {
  GetV1WalletsByWalletAddressTransactionsData,
  GetV1WalletsByWalletAddressTransactionsResponse,
} from "@thirdweb-dev/insight";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";

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
  const [
    { getV1WalletsByWalletAddressTransactions },
    { getThirdwebDomains },
    { getClientFetch },
    { assertInsightEnabled },
    { stringify },
  ] = await Promise.all([
    import("@thirdweb-dev/insight"),
    import("../utils/domains.js"),
    import("../utils/fetch.js"),
    import("./common.js"),
    import("../utils/json.js"),
  ]);

  await assertInsightEnabled(args.chains);
  const threeMonthsAgoInSeconds = Math.floor(
    (Date.now() - 3 * 30 * 24 * 60 * 60 * 1000) / 1000,
  );
  const { client, walletAddress, chains, queryOptions } = args;

  const defaultQueryOptions: GetV1WalletsByWalletAddressTransactionsData["query"] =
    {
      chain: chains.map((chain) => chain.id),
      filter_block_timestamp_gte: threeMonthsAgoInSeconds,
      limit: 100,
    };

  const result = await getV1WalletsByWalletAddressTransactions({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
    path: {
      wallet_address: walletAddress,
    },
    query: {
      ...defaultQueryOptions,
      ...queryOptions,
    },
  });
  if (result.error) {
    throw new Error(
      `${result.response.status} ${result.response.statusText} - ${result.error ? stringify(result.error) : "Unknown error"}`,
    );
  }
  return result.data.data || [];
}
