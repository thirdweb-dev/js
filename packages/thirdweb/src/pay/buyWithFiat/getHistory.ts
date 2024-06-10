import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getPayBuyWithFiatHistoryEndpoint } from "../utils/definitions.js";
import type { BuyWithFiatStatus } from "./getStatus.js";

/**
 * The parameters for [`getBuyWithFiatHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatHistory) function
 * @buyCrypto
 */
export type BuyWithFiatHistoryParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   */
  client: ThirdwebClient;
  /**
   * The address of the wallet to get the wallet history for
   */
  walletAddress: string;
  /**
   * The number of results to return in a single page. The default value is `10`.
   */
  count: number;
  /**
   * index of the first result to return. The default value is `0`.
   *
   * If you want to start the list from nth item, you can set the start value to (n-1).
   */
  start: number;
};

/**
 * The results for [`getBuyWithFiatHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatHistory) function
 * @buyCrypto
 */
export type BuyWithFiatHistoryData = {
  page: BuyWithFiatStatus[];
  hasNextPage: boolean;
};

/**
 * Get the "Buy with fiat" transaction history for a given wallet address
 * @param params Object of type [`BuyWithFiatHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatHistoryParams)
 * @example
 *
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getBuyWithFiatHistory } from "thirdweb/pay";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 *
 * // get the 10 latest "Buy with fiat" transactions dony by the wallet
 * const history = await getBuyWithFiatHistory({
 *  client: client,
 *  walletAddress: '0x...',
 *  start: 0,
 *  count: 10,
 * })
 * ```
 * @returns Object of type [`BuyWithFiatHistoryData`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatHistoryData)
 * @buyCrypto
 */
export async function getBuyWithFiatHistory(
  params: BuyWithFiatHistoryParams,
): Promise<BuyWithFiatHistoryData> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("walletAddress", params.walletAddress);
    queryParams.append("start", params.start.toString());
    queryParams.append("count", params.count.toString());

    const queryString = queryParams.toString();
    const url = `${getPayBuyWithFiatHistoryEndpoint()}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    // Assuming the response directly matches the BuyWithFiatStatus response interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BuyWithFiatHistoryData = (await response.json()).result;
    return data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}
