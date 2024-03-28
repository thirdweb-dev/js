import {
  BuyWithCryptoHistoryParams as BuyWithCryptoHistoryParamsV5,
  createThirdwebClient,
} from "thirdweb";
import {
  getBuyWithCryptoHistory as getBuyWithCryptoHistoryV5,
  type BuyWithCryptoHistoryData,
} from "thirdweb/pay";

/**
 * The parameters for [`getBuyWithCryptoHistory`](https://portal.thirdweb.com/references/typescript/v4/getBuyWithCryptoHistory) function
 * It takes the wallet history address and optional cursor and page size. for paginated results.
 * @buyCrypto
 */
export type BuyWithCryptoHistoryParams = {
  /**
   * A client ID to identify the client making the request.
   *
   * You can get a client ID from the dashboard over at https://thirdweb.com/dashboard/settings/api-keys
   */
  clientId: string;
} & Omit<BuyWithCryptoHistoryParamsV5, "client">;

/**
 * Gets the History of purchases for a given wallet address
 * @param params Object of type [`BuyWithCryptoHistoryParams`](https://portal.thirdweb.com/references/typescript/v4/BuyWithCryptoHistoryParams)
 * @example
 *
 * ```ts
//  * import { BuyWithCryptoHistoryData } from "@thirdweb-dev/sdk";
 *
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
  return getBuyWithCryptoHistoryV5({
    ...params,
    client: createThirdwebClient({
      clientId: params.clientId,
    }),
  });
}
