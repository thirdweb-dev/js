import type { ThirdwebClient } from "../client/client.js";
import type { BuyWithCryptoStatus, BuyWithFiatStatus } from "../exports/pay.js";
import { getClientFetch } from "../utils/fetch.js";
import { getPayBuyHistoryEndpoint } from "./utils/definitions.js";

/**
 * The parameters for [`getBuyHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyHistory) function
 * It takes the wallet history address and optional cursor and page size for paginated results.
 */
export type BuyHistoryParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   */
  client: ThirdwebClient;
  /**
   * The address of the wallet to get the wallet history for
   */
  walletAddress: string;
  /**
   * The number of results to return in a single page. The default value is 10.
   */
  count: number;
  /**
   * The cursor for the page of results to return. The default value is `undefined`.
   */
  start: number;
};

/**
 * The result for [`getBuyHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoHistory) function
 * It includes information about transactions that the wallet address has made through thirdweb buy with crypto.
 * @buyCrypto
 */
export type BuyHistoryData = {
  page: Array<
    | {
        buyWithFiatStatus: BuyWithFiatStatus;
      }
    | {
        buyWithCryptoStatus: BuyWithCryptoStatus;
      }
  >;
  hasNextPage: boolean;
};

/**
 * Gets the "Buy with Cryto" and "Buy with Fiat" transaction history of given wallet address
 * @param params Object of type [`BuyHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyHistoryParams)
 * @example
 *
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { BuyWithCryptoHistoryData } from "thirdweb/pay";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 *
 * // grabs the history of purchase transactions for the wallet address
 * const status = await getBuyHistory({
 *  client,
 *  walletAddress: "0x...",
 * })
 * ```
 * @returns Object of type [`BuyHistoryData`](https://portal.thirdweb.com/references/typescript/v5/BuyHistoryData)
 */
export async function getBuyHistory(
  params: BuyHistoryParams,
): Promise<BuyHistoryData> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("walletAddress", params.walletAddress);
    queryParams.append("start", params.start.toString());
    queryParams.append("count", params.count.toString());

    const queryString = queryParams.toString();
    const url = `${getPayBuyHistoryEndpoint()}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BuyHistoryData = (await response.json()).result;
    return data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}
