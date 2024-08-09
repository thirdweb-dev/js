import type { DecodeEventLogReturnType, Log } from "viem";
import type { ThirdwebClient } from "../../client/client.js";
import type { Address } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { Prettify } from "../../utils/type-utils.js";
import { formatChainsawEvents } from "../formatter.js";
import { addRequestPagination } from "../paging.js";
import type {
  ChainsawInternalEvents,
  ChainsawPagingParams,
  ChainsawResponse,
} from "../types.js";
import { getEventsEndpoint } from "../urls.js";

export type GetEventsInterval = "hour" | "day" | "week" | "month";
export type GetEventsGroupBy = "time" | "name" | "chainId" | "contractAddress";

export type GetEventsParams = Prettify<
  {
    /**
     * A client is the entry point to the thirdweb SDK. It is required for all other actions.
     *
     * You can create a client using the `createThirdwebClient` function.
     * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
     *
     */
    client: ThirdwebClient;
    /**
     * Contract addresses to fetch events for
     */
    contractAddresses: Address[];
    /**
     * Chain IDs to search events on
     */
    chainIds?: number[];
    /**
     * Start point for events date range. Default is 7 days ago
     */
    startDate?: Date;
    /**
     * End point for events date range. Default is current date
     */
    endDate?: Date;
    /**
     * If grouped by time, determines the bucket length
     */
    interval?: GetEventsInterval;
    /**
     * Parameters to group events by for the count
     */
    groupBy?: GetEventsGroupBy[];
  } & ChainsawPagingParams
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
  page?: number;
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
 * import { createThirdwebClient } from "thirdweb";
 * import { getEvents } from "thirdweb/chainsaw";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const startDate = new Date(Date.now() - 48 * 60 * 60_000);
 * const endDate = new Date();
 * const events = await getEvents({
 *  client,
 *  contractAddresses: ["0x..."],
 *  chainIds: [1],
 *  startDate,
 *  endDate,
 *  groupBy: ["time"],
 *  interval: ["day"],
 *  pageSize: 20,
 *  page: 1
 * });
 * ```
 * @chainsaw
 */
export async function getEvents(
  params: GetEventsParams,
): Promise<GetEventsResult> {
  try {
    const queryParams = addRequestPagination(
      new URLSearchParams({
        ...(params.startDate && { startDate: params.startDate.toISOString() }),
        ...(params.endDate && { endDate: params.endDate.toISOString() }),
        ...(params.interval && { interval: params.interval }),
      }),
      params,
    );
    for (const contractAddress of params.contractAddresses) {
      queryParams.append("contractAddresses[]", contractAddress);
    }
    for (const chainId of params.chainIds || []) {
      queryParams.append("chainIds[]", chainId.toString());
    }
    for (const groupBy of params.groupBy || []) {
      queryParams.append("groupBy[]", groupBy);
    }
    const url = `${getEventsEndpoint()}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<ChainsawInternalEvents> =
      await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      events: formatChainsawEvents(data.data),
      page: data.page,
    };
  } catch (error) {
    throw new Error("Fetch failed", { cause: error });
  }
}
