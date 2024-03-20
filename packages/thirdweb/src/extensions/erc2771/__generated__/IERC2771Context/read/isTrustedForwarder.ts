import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isTrustedForwarder" function.
 */
export type IsTrustedForwarderParams = {
  forwarder: AbiParameterToPrimitiveType<{
    type: "address";
    name: "forwarder";
  }>;
};

/**
 * Calls the "isTrustedForwarder" function on the contract.
 * @param options - The options for the isTrustedForwarder function.
 * @returns The parsed result of the function call.
 * @extension ERC2771
 * @example
 * ```
 * import { isTrustedForwarder } from "thirdweb/extensions/erc2771";
 *
 * const result = await isTrustedForwarder({
 *  forwarder: ...,
 * });
 *
 * ```
 */
export async function isTrustedForwarder(
  options: BaseTransactionOptions<IsTrustedForwarderParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x572b6c05",
      [
        {
          type: "address",
          name: "forwarder",
        },
      ],
      [
        {
          type: "bool",
        },
      ],
    ],
    params: [options.forwarder],
  });
}
