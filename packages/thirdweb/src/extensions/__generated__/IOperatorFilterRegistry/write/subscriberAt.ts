import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "subscriberAt" function.
 */
export type SubscriberAtParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  index: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "index";
    type: "uint256";
  }>;
};

/**
 * Calls the subscriberAt function on the contract.
 * @param options - The options for the subscriberAt function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { subscriberAt } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = subscriberAt({
 *  registrant: ...,
 *  index: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function subscriberAt(
  options: BaseTransactionOptions<SubscriberAtParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x55940e51",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
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
    params: [options.registrant, options.index],
  });
}
