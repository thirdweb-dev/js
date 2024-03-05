import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "burn" function.
 */
export type BurnParams = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
};

/**
 * Calls the "burn" function on the contract.
 * @param options - The options for the "burn" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { burn } from "thirdweb/extensions/erc20";
 *
 * const transaction = burn({
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burn(options: BaseTransactionOptions<BurnParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x42966c68",
      [
        {
          type: "uint256",
          name: "amount",
        },
      ],
      [],
    ],
    params: [options.amount],
  });
}
