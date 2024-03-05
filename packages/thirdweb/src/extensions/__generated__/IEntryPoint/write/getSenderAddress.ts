import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getSenderAddress" function.
 */
export type GetSenderAddressParams = {
  initCode: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "initCode";
    type: "bytes";
  }>;
};

/**
 * Calls the getSenderAddress function on the contract.
 * @param options - The options for the getSenderAddress function.
 * @returns A prepared transaction object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { getSenderAddress } from "thirdweb/extensions/IEntryPoint";
 *
 * const transaction = getSenderAddress({
 *  initCode: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function getSenderAddress(
  options: BaseTransactionOptions<GetSenderAddressParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x9b249f69",
      [
        {
          internalType: "bytes",
          name: "initCode",
          type: "bytes",
        },
      ],
      [],
    ],
    params: [options.initCode],
  });
}
