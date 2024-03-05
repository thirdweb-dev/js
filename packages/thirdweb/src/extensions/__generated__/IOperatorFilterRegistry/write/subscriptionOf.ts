import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "subscriptionOf" function.
 */
export type SubscriptionOfParams = {
  addr: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "addr";
    type: "address";
  }>;
};

/**
 * Calls the subscriptionOf function on the contract.
 * @param options - The options for the subscriptionOf function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { subscriptionOf } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = subscriptionOf({
 *  addr: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function subscriptionOf(
  options: BaseTransactionOptions<SubscriptionOfParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x3c5030bb",
      [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
      ],
    ],
    params: [options.addr],
  });
}
