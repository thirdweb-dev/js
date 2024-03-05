import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "registerAndSubscribe" function.
 */
export type RegisterAndSubscribeParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  subscription: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "subscription";
    type: "address";
  }>;
};

/**
 * Calls the registerAndSubscribe function on the contract.
 * @param options - The options for the registerAndSubscribe function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { registerAndSubscribe } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = registerAndSubscribe({
 *  registrant: ...,
 *  subscription: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function registerAndSubscribe(
  options: BaseTransactionOptions<RegisterAndSubscribeParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x7d3e3dbe",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "address",
          name: "subscription",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.registrant, options.subscription],
  });
}
