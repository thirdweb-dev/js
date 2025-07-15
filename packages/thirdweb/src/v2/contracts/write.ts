import { writeContract } from "@thirdweb-dev/api";
import { getThirdwebBaseUrl } from "../../utils/domains.js";
import { getClientFetch } from "../../utils/fetch.js";
import { stringify } from "../../utils/json.js";
import type { UserWallet } from "../wallets/types.js";
import type { ContractCall } from "./types.js";

export type WriteOptions = {
  wallet: UserWallet;
  chainId: number;
  calls: ContractCall[];
};

/**
 * Write to a contract
 * @param options - Options including the wallet, contract address, chain id, and calls
 * @returns Promise that resolves to the transaction id
 * @example
 * ```typescript
 * const transactionId = await Contracts.write({
 *   wallet: userWallet,
 *   contractAddress: "0x...",
 *   chainId: 1,
 *   calls: [{ method: "function transfer(address,uint256)", params: ["0x...", "100"] }],
 * });
 * ```
 */
export async function write(options: WriteOptions) {
  const result = await writeContract({
    baseUrl: getThirdwebBaseUrl("api"),
    fetch: getClientFetch(options.wallet.client),
    headers: {
      Authorization: `Bearer ${options.wallet.authToken}`,
    },
    body: {
      chainId: options.chainId,
      from: options.wallet.address,
      calls: options.calls.map((call) => ({
        contractAddress: call.contractAddress,
        method: call.method,
        params: call.params,
        value: call.value,
      })),
    },
  });
  if (result.error) {
    throw new Error(
      `Failed to write contract: ${result.response.status} - ${stringify(result.error)}`,
    );
  }
  const transactionId = result.data?.result?.transactionIds?.[0];
  if (!transactionId) {
    throw new Error("Failed to write contract: no transaction id");
  }
  return transactionId;
}
