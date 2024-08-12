import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { ChainsawResponse } from "../types.ts";
import { getLatestBlockNumberEndpoint } from "../urls.js";

export type GetLatestBlockNumberParams = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   *
   * You can create a client using the `createThirdwebClient` function.
   * Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   */
  client: ThirdwebClient;
  /**
   * The chain to fetch the block from
   */
  chain: Chain;
};

export type GetLatestBlockNumberResult = {
  latestBlockNumber: number;
};

/**
 * @beta
 *
 * Get the block number of the latest indexed block
 *
 * @param {GetLatestBlockNumberParams} params
 * @returns {Promise<GetLatestBlockNumberResult>}
 *
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * import { getLatestBlockNumber } from "thirdweb/chainsaw";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const { latestBlockNumber } = await getLatestBlockNumber({
 *  client,
 *  chain: defineChain(1)
 * });
 * ```
 * @chainsaw
 */
export async function getLatestBlockNumber(
  params: GetLatestBlockNumberParams,
): Promise<GetLatestBlockNumberResult> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("chainId", params.chain.id.toString());
    const url = `${getLatestBlockNumberEndpoint()}?${queryParams.toString()}`;

    const response = await getClientFetch(params.client)(url);
    if (!response.ok) {
      response.body?.cancel();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChainsawResponse<number> = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    if (!data.data) {
      throw new Error("unable to fetch latest block number");
    }
    return { latestBlockNumber: data.data };
  } catch (error) {
    throw new Error("Fetch failed", { cause: error });
  }
}
