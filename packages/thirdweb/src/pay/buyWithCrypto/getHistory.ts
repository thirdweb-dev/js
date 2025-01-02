import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import { getPayBuyWithCryptoHistoryEndpoint } from "../utils/definitions.js";
import type { BuyWithCryptoStatus } from "./getStatus.js";

/**
 * The parameters for [`getBuyWithCryptoHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoHistory) function
 * It takes the wallet history address and optional cursor and page size. for paginated results.
 * @buyCrypto
 */
export type BuyWithCryptoHistoryParams = {
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
 * The results for [`getBuyWithCryptoHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoHistory) function
 * It includes information about transactions that the wallet address has made through thirdweb buy with crypto.
 * @buyCrypto
 */
export type BuyWithCryptoHistoryData = {
  page: BuyWithCryptoStatus[];
  hasNextPage: boolean;
};

/**
 * Gets the History of purchases for a given wallet address
 * @param params Object of type [`BuyWithCryptoHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoHistoryParams)
 * @example
 *
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { BuyWithCryptoHistoryData } from "thirdweb/pay";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const walletAddress = "0x...";
 * const params = {
 *  client,
 *  walletAddress,
 * };
 *
 * // grabs the history of purchase transactions for the wallet address
 * const status = await getBuyWithCryptoHistory(params)
 * ```
 * @returns Object of type [`BuyWithCryptoHistoryData`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoHistoryData)
 * @buyCrypto
 */
export async function getBuyWithCryptoHistory(
  params: BuyWithCryptoHistoryParams,
): Promise<BuyWithCryptoHistoryData> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("walletAddress", params.walletAddress);
    queryParams.append("start", params.start.toString());
    queryParams.append("count", params.count.toString());

    const queryString = queryParams.toString();
    const url = `${getPayBuyWithCryptoHistoryEndpoint()}?${queryString}`;

    const response = await getClientFetch(params.client)(url);

    // Assuming the response directly matches the SwapResponse interface
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BuyWithCryptoHistoryData = (await response.json()).result;
    return data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
}
