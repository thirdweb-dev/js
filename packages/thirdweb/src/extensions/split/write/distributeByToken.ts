import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

/**
 * This extension is similar to the `distribute` extension,
 * however it require you to specify the token (address) that you want to distribute
 * @param options.tokenAddress - The contract address of the token you want to distribute
 * @returns A prepared transaction object.
 * @extension SPLIT
 * @example
 * ```ts
 * import { distributeByToken } from "thirdweb/extensions/split";
 *
 * const transaction = distributeByToken();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function distributeByToken(
  options: BaseTransactionOptions<{ tokenAddress: string }>,
) {
  return prepareContractCall({
    method: "function distribute(address token)",
    params: [options.tokenAddress],
    ...options,
  });
}
