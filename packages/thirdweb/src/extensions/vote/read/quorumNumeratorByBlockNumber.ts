import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

/**
 * Calls the "quorumDenominator" function on the contract with an extra param called `blockNumber`.
 * This extension is similar to the `quorumDenominator` extension, except that it takes in a bigint (blockNumber)
 * @param options - The options for the quorumDenominator function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { quorumNumeratorByBlockNumber } from "thirdweb/extensions/vote";
 *
 * const result = await quorumNumeratorByBlockNumber({
 *  contract,
 *  blockNumber: 13232234232n,
 * });
 *
 * ```
 */
export async function quorumNumeratorByBlockNumber(
  options: BaseTransactionOptions<{ blockNumber: bigint }>,
) {
  return readContract({
    contract: options.contract,
    method:
      "function quorumNumerator(uint256 blockNumber) view returns (uint256)",
    params: [options.blockNumber],
  });
}
