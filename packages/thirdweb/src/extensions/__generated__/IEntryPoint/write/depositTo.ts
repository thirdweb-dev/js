import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "depositTo" function.
 */
export type DepositToParams = {
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Calls the depositTo function on the contract.
 * @param options - The options for the depositTo function.
 * @returns A prepared transaction object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { depositTo } from "thirdweb/extensions/IEntryPoint";
 *
 * const transaction = depositTo({
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function depositTo(options: BaseTransactionOptions<DepositToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xb760faf9",
      [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.account],
  });
}
