import type {
  GetV1TokensData,
  GetV1TokensResponse,
} from "@thirdweb-dev/insight";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { GetWalletBalanceResult } from "../wallets/utils/getWalletBalance.js";

type OwnedToken = GetV1TokensResponse["data"][number];

/**
 * Get ERC20 tokens owned by an address
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const tokens = await Insight.getOwnedTokens({
 *   client,
 *   chains: [sepolia],
 *   ownerAddress: "0x1234567890123456789012345678901234567890",
 * });
 * ```
 * @insight
 */
export async function getOwnedTokens(args: {
  client: ThirdwebClient;
  chains: Chain[];
  ownerAddress: string;
  queryOptions?: Omit<
    GetV1TokensData["query"],
    "owner_address" | "chain_id" | "chain"
  >;
}): Promise<GetWalletBalanceResult[]> {
  const [
    { getV1Tokens },
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

  const { client, chains, ownerAddress, queryOptions } = args;

  await assertInsightEnabled(chains);

  const defaultQueryOptions: GetV1TokensData["query"] = {
    chain_id: chains.length > 0 ? chains.map((chain) => chain.id) : [1],
    include_native: "true",
    include_spam: "false",
    limit: 50,
    metadata: "true",
    owner_address: ownerAddress,
  };

  const result = await getV1Tokens({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
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

  return transformOwnedToken(result.data?.data ?? []);
}

async function transformOwnedToken(
  token: OwnedToken[],
): Promise<GetWalletBalanceResult[]> {
  const { toTokens } = await import("../utils/units.js");
  return token.map((t) => {
    const decimals = t.decimals ?? 18;
    const value = BigInt(t.balance);
    return {
      chainId: t.chain_id,
      decimals,
      displayValue: toTokens(value, decimals),
      name: t.name ?? "",
      symbol: t.symbol ?? "",
      tokenAddress: t.token_address,
      value,
    };
  });
}
