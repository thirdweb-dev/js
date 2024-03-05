import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "subscribe" function.
 */
export type SubscribeParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  registrantToSubscribe: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrantToSubscribe";
    type: "address";
  }>;
};

/**
 * Calls the subscribe function on the contract.
 * @param options - The options for the subscribe function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { subscribe } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = subscribe({
 *  registrant: ...,
 *  registrantToSubscribe: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function subscribe(options: BaseTransactionOptions<SubscribeParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xb314d414",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "address",
          name: "registrantToSubscribe",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.registrant, options.registrantToSubscribe],
  });
}
