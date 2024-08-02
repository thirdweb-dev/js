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

export type GetEventsResult = {
  events: Events;
  page?: number;
};

/**
 * Get events
 *
 * @beta
 */
export async function getEvents(
  params: GetEventsParams,
): Promise<GetEventsResult> {
  try {
    const queryParams = addPagingToRequest(
      new URLSearchParams({
        ...(params.startDate && { startDate: params.startDate.toISOString() }),
        ...(params.endDate && { endDate: params.endDate.toISOString() }),
        ...(params.interval && { interval: params.interval }),
        ...(params.groupBy && { groupBy: params.groupBy.toString() }),
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

    const data: ChainsawResponse<Events> = await response.json();
    if (data.error) throw new Error(data.error);
    return {
      events: data.data || [],
      page: data.page,
    };
  } catch (error) {
    throw new Error(`Fetch failed: ${error}, ${JSON.stringify(params)}`);
  }
}
