import type { ThirdwebClient } from "../../client/client.js";
import type { Address } from "../../utils/address.js";
import { getClientFetch } from "../../utils/fetch.js";
import { addPagingToRequest } from "../paging.js";
import type {
  ChainsawPagingParams,
  ChainsawResponse,
  Events,
} from "../types.d.ts";
import { getEventsEndpoint } from "../urls.js";

export type GetEventsInterval = "hour" | "day" | "week" | "month";
export type GetEventsGroupBy = "time" | "chainId" | "contractAddress";

export type GetEventsParams = {
  client: ThirdwebClient;
  contractAddresses: Address[];
  chainIds?: number[];
  startDate?: Date;
  endDate?: Date;
  interval?: GetEventsInterval;
  groupBy?: GetEventsGroupBy[];
} & ChainsawPagingParams;

/**
 * Get events
 *
 * @beta
 */
export async function getEvents(
  params: GetEventsParams,
): Promise<ChainsawResponse<Events>> {
  try {
    const queryParams = addPagingToRequest(
      new URLSearchParams({
        contractAddresses: params.contractAddresses.toString(),
        ...(params.chainIds && { chainIds: params.chainIds.toString() }),
        ...(params.startDate && { startDate: params.startDate.toISOString() }),
        ...(params.endDate && { endDate: params.endDate.toISOString() }),
        ...(params.interval && { interval: params.interval }),
        ...(params.groupBy && { groupBy: params.groupBy.toString() }),
      }),
      params,
    );
    const url = `${getEventsEndpoint()}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<Events> = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}
