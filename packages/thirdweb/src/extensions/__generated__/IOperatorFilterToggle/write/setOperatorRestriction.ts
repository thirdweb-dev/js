import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setOperatorRestriction" function.
 */
export type SetOperatorRestrictionParams = {
  restriction: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "restriction";
    type: "bool";
  }>;
};

/**
 * Calls the setOperatorRestriction function on the contract.
 * @param options - The options for the setOperatorRestriction function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERTOGGLE
 * @example
 * ```
 * import { setOperatorRestriction } from "thirdweb/extensions/IOperatorFilterToggle";
 *
 * const transaction = setOperatorRestriction({
 *  restriction: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setOperatorRestriction(
  options: BaseTransactionOptions<SetOperatorRestrictionParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x32f0cd64",
      [
        {
          internalType: "bool",
          name: "restriction",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.restriction],
  });
}
