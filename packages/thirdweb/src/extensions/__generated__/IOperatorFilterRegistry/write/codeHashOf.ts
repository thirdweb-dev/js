import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "codeHashOf" function.
 */
export type CodeHashOfParams = {
  addr: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "addr";
    type: "address";
  }>;
};

/**
 * Calls the codeHashOf function on the contract.
 * @param options - The options for the codeHashOf function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { codeHashOf } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = codeHashOf({
 *  addr: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function codeHashOf(options: BaseTransactionOptions<CodeHashOfParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xbbd652c7",
      [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
    ],
    params: [options.addr],
  });
}
