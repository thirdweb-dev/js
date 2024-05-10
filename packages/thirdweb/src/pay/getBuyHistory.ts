import type { ThirdwebClient } from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";
import type { BuyWithCryptoStatus } from "./buyWithCrypto/getStatus.js";
import type { BuyWithFiatStatus } from "./buyWithFiat/getStatus.js";
import { getPayBuyHistoryEndpoint } from "./utils/definitions.js";

/**
 * The parameters for [`getBuyHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyHistory) function
 */
export type BuyHistoryParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   */
  client: ThirdwebClient;
  /**
   * The wallet address to get the buy history for.
   */
  walletAddress: string;
  /**
   * The number of results to return.
   *
   * The default value is `10`.
   */
  count: number;
  /**
   * Index of the first result to return. The default value is `0`.
   */
  start: number;
};

/**
 * The result for [`getBuyHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoHistory) function
 *
 * It includes both "Buy with Crypto" and "Buy with Fiat" transactions
 */
export type BuyHistoryData = {
  /**
   * The list of buy transactions.
   */
  page: Array<
    | {
        buyWithFiatStatus: BuyWithFiatStatus;
      }
    | {
        buyWithCryptoStatus: BuyWithCryptoStatus;
      }
  >;
  /**
   * Whether there are more pages of results.
   */
  hasNextPage: boolean;
};

/**
 * Get Buy transaction history for a given wallet address.
 *
 * This includes both "Buy with Cryto" and "Buy with Fiat" transactions
 *
 * @param params Object of type [`BuyHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyHistoryParams)
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getBuyHistory } from "thirdweb/pay";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 *
 * const history = await getBuyHistory({
 *  client,
 *  walletAddress: "0x...",
 * })
 * ```
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
