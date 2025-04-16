import type {
  GetV1TokensErc20ByOwnerAddressData,
  GetV1TokensErc20ByOwnerAddressResponse,
} from "@thirdweb-dev/insight";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { GetWalletBalanceResult } from "../wallets/utils/getWalletBalance.js";

type OwnedToken = GetV1TokensErc20ByOwnerAddressResponse["data"][number];

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
  queryOptions?: GetV1TokensErc20ByOwnerAddressData["query"];
}): Promise<GetWalletBalanceResult[]> {
  const [
    { getV1TokensErc20ByOwnerAddress },
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

  const defaultQueryOptions: GetV1TokensErc20ByOwnerAddressData["query"] = {
    chain: chains.map((chain) => chain.id),
    include_spam: "false",
    metadata: "true",
    limit: 50,
  };

  const result = await getV1TokensErc20ByOwnerAddress({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
    path: {
      ownerAddress: ownerAddress,
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
      value,
      displayValue: toTokens(value, decimals),
      tokenAddress: t.token_address,
      chainId: t.chain_id,
      decimals,
      symbol: t.symbol ?? "",
      name: t.name ?? "",
    };
  });
}
