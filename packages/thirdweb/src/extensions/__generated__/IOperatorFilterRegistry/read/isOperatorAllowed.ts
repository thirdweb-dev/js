import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isOperatorAllowed" function.
 */
export type IsOperatorAllowedParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  operator: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
};

/**
 * Calls the isOperatorAllowed function on the contract.
 * @param options - The options for the isOperatorAllowed function.
 * @returns The parsed result of the function call.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { isOperatorAllowed } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const result = await isOperatorAllowed({
 *  registrant: ...,
 *  operator: ...,
 * });
 *
 * ```
 */
export async function isOperatorAllowed(
  options: BaseTransactionOptions<IsOperatorAllowedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc6171134",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.registrant, options.operator],
  });
}
