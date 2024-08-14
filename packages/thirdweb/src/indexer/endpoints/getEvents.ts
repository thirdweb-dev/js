import type { DecodeEventLogReturnType, Log } from "viem";
import type { ThirdwebContract } from "../../contract/contract.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatIndexerEvents } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  IndexerInternalEvent,
  IndexerPagingParams,
  IndexerResponse,
} from "../types.js";
import { getEventsEndpoint } from "../urls.js";

export type GetEventsParams = Prettify<
  {
    /**
     * Contract to fetch events for
     */
    contract: ThirdwebContract;
    /**
     * Start point for events date range. Default is 7 days ago
     */
    startDate?: Date;
    /**
     * End point for events date range. Default is current date
     */
    endDate?: Date;
  } & IndexerPagingParams
>;

export type GetEventsResult = {
  events: Prettify<
    Log &
    DecodeEventLogReturnType & {
      chainId?: number;
      count: bigint;
      time?: Date;
    }
  >[];
};

/**
 * @beta
 *
 * Get events emitted by contract(s)
 *
 * @param {GetEventsParams} params
 * @returns {Promise<GetEventsResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient, getEvents, defineChain, getContract } from "thirdweb";
 *
 * const startDate = new Date(Date.now() - 48 * 60 * 60_000);
 * const endDate = new Date();
 * const contract = getContract({
 *  address: "0x...",
 *  client,
 *  chain: defineChain(1)
 * });
 * const events = await getEvents({
 *  contract,
 *  startDate,
 *  endDate,
 *  pageSize: 20,
 *  page: 1
 * });
 * ```
 * @contract
 */
export async function getEvents(
  params: GetEventsParams,
): Promise<GetEventsResult> {
  try {
    const url = getEndpointUrl(params);
    const response = await getClientFetch(params.contract.client)(
      url.toString(),
    );
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(
        `Failed to get events for contract ${params.contract.address}: ${response.status}`,
      );
    }

    const data: IndexerResponse<IndexerInternalEvent[]> = await response.json();
    if (data.error || !data.data) {
      throw new Error(data.error);
    }
    return {
      events: formatIndexerEvents(data.data),
    };
  } catch (error) {
    throw new Error("Failed to get events", { cause: error });
  }
}

function getEndpointUrl(params: GetEventsParams): URL {
  const url = getEventsEndpoint();
  url.searchParams.append("contractAddresses", params.contract.address);
  url.searchParams.append("chainIds", params.contract.chain.id.toString());
  if (params.startDate) {
    url.searchParams.append("startDate", params.startDate.toISOString());
  }
  if (params.endDate) {
    url.searchParams.append("endDate", params.endDate.toISOString());
  }
  return addRequestPagination(url, params);
}
