import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "delegates" function.
 */
export type DelegatesParams = {
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Calls the delegates function on the contract.
 * @param options - The options for the delegates function.
 * @returns The parsed result of the function call.
 * @extension IVOTES
 * @example
 * ```
 * import { delegates } from "thirdweb/extensions/IVotes";
 *
 * const result = await delegates({
 *  account: ...,
 * });
 *
 * ```
 */
export async function delegates(
  options: BaseTransactionOptions<DelegatesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x587cde1e",
      [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [options.account],
  });
}
