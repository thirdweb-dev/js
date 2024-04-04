import {
  BuyWithCryptoHistoryParams as BuyWithCryptoHistoryParamsV5,
  createThirdwebClient,
  type ThirdwebClient,
} from "thirdweb";
import {
  getBuyWithCryptoHistory as getBuyWithCryptoHistoryV5,
  type BuyWithCryptoHistoryData,
} from "thirdweb/pay";

/**
 * The parameters for [`getBuyWithCryptoHistory`](https://portal.thirdweb.com/references/typescript/v4/getBuyWithCryptoHistory) function
 * It takes the wallet history address and optional cursor and page size. for paginated results.
 */
export type BuyWithCryptoHistoryParams = {
  /**
   * A client ID to identify the client making the request.
   *
   * You can get a client ID from the dashboard over at https://thirdweb.com/dashboard/settings/api-keys
   */
  clientId?: string;

  /**
   * A secretKey of the API key to identify the server making the request.
   *
   * You can get an API key from the dashboard over at https://thirdweb.com/dashboard/settings/api-keys
   */
  secretKey?: string;
} & Omit<BuyWithCryptoHistoryParamsV5, "client">;

export { type BuyWithCryptoHistoryData } from "thirdweb/pay";

/**
 * Gets the History of purchases for a given wallet address
 * @param params - Object of type [`BuyWithCryptoHistoryParams`](https://portal.thirdweb.com/references/typescript/v4/BuyWithCryptoHistoryParams)
 * @example
 *
 * ```ts
//  * import { BuyWithCryptoHistoryData } from "@thirdweb-dev/sdk";
 *
 * const walletAddress = "0x...";
 * const params = {
 *  clientId: "YOUR_CLIENT_ID",
 *  walletAddress,
 * };
 *
 * // grabs the history of purchase transactions for the wallet address
 * const status = await getBuyWithCryptoHistory(params)
 * ```
 * @returns Object of type [`BuyWithCryptoHistoryData`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoHistoryData)
 */
export async function getBuyWithCryptoHistory(
  params: BuyWithCryptoHistoryParams,
): Promise<BuyWithCryptoHistoryData> {
  let client: ThirdwebClient | undefined;

  if (params.secretKey) {
    client = createThirdwebClient({
      secretKey: params.secretKey,
    });
  }

  if (params.clientId) {
    client = createThirdwebClient({
      clientId: params.clientId,
    });
  }

  if (!client) {
    throw new Error(
      "You must provide either a `clientId` or a `secretKey` to get a quote",
    );
  }

  return getBuyWithCryptoHistoryV5({
    ...params,
    client: client,
  });
}
