import type {
  GetV1EventsByContractAddressData,
  GetV1EventsByContractAddressResponse,
} from "@thirdweb-dev/insight";
import type { AbiEvent } from "ox/AbiEvent";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { PreparedEvent } from "../event/prepare-event.js";

export type ContractEvent = NonNullable<
  GetV1EventsByContractAddressResponse["data"]
>[number];

/**
 * Get contract events
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const events = await Insight.getContractEvents({
 *   client,
 *   chains: [sepolia],
 *   contractAddress: "0x1234567890123456789012345678901234567890",
 *   event: transferEvent(),
 *   decodeLogs: true,
 * });
 * ```
 * @insight
 */
export async function getContractEvents(options: {
  client: ThirdwebClient;
  chains: Chain[];
  contractAddress: string;
  event?: PreparedEvent<AbiEvent>;
  decodeLogs?: boolean;
  queryOptions?: Omit<
    GetV1EventsByContractAddressData["query"],
    "chain" | "decode"
  >;
}): Promise<ContractEvent[]> {
  const [
    { getV1EventsByContractAddress },
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

  const { client, chains, contractAddress, event, queryOptions, decodeLogs } =
    options;

  await assertInsightEnabled(chains);

  const defaultQueryOptions: GetV1EventsByContractAddressData["query"] = {
    chain: chains.map((chain) => chain.id),
    decode: decodeLogs,
    limit: 100,
  };

  if (event) {
    defaultQueryOptions.filter_topic_0 = event.topics[0];
    defaultQueryOptions.filter_topic_1 = event.topics[1];
    defaultQueryOptions.filter_topic_2 = event.topics[2];
    defaultQueryOptions.filter_topic_3 = event.topics[3];
  }

  const result = await getV1EventsByContractAddress({
    baseUrl: `https://${getThirdwebDomains().insight}`,
    fetch: getClientFetch(client),
    path: {
      contractAddress,
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

  return result.data?.data ?? [];
}
