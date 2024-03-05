import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "unpublishContract" function.
 */
export type UnpublishContractParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    type: "string";
    name: "contractId";
  }>;
};

/**
 * Calls the "unpublishContract" function on the contract.
 * @param options - The options for the "unpublishContract" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { unpublishContract } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = unpublishContract({
 *  publisher: ...,
 *  contractId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function unpublishContract(
  options: BaseTransactionOptions<UnpublishContractParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x06eb56cc",
      [
        {
          type: "address",
          name: "publisher",
        },
        {
          type: "string",
          name: "contractId",
        },
      ],
      [],
    ],
    params: [options.publisher, options.contractId],
  });
}
