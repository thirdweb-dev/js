import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "unpublishContract" function.
 */
export type UnpublishContractParams = {
  publisher: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "publisher";
    type: "address";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "contractId";
    type: "string";
  }>;
};

/**
 * Calls the unpublishContract function on the contract.
 * @param options - The options for the unpublishContract function.
 * @returns A prepared transaction object.
 * @extension ICONTRACTPUBLISHER
 * @example
 * ```
 * import { unpublishContract } from "thirdweb/extensions/IContractPublisher";
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
          internalType: "address",
          name: "publisher",
          type: "address",
        },
        {
          internalType: "string",
          name: "contractId",
          type: "string",
        },
      ],
      [],
    ],
    params: [options.publisher, options.contractId],
  });
}
