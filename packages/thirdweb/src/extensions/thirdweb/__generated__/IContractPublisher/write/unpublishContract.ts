import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "unpublishContract" function.
 */

type UnpublishContractParamsInternal = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    type: "string";
    name: "contractId";
  }>;
};

export type UnpublishContractParams = Prettify<
  | UnpublishContractParamsInternal
  | {
      asyncParams: () => Promise<UnpublishContractParamsInternal>;
    }
>;
const FN_SELECTOR = "0x06eb56cc" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "publisher",
  },
  {
    type: "string",
    name: "contractId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "unpublishContract" function.
 * @param options - The options for the unpublishContract function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```
 * import { encodeUnpublishContractParams } "thirdweb/extensions/thirdweb";
 * const result = encodeUnpublishContractParams({
 *  publisher: ...,
 *  contractId: ...,
 * });
 * ```
 */
export function encodeUnpublishContractParams(
  options: UnpublishContractParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.publisher,
    options.contractId,
  ]);
}

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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.publisher,
              resolvedParams.contractId,
            ] as const;
          }
        : [options.publisher, options.contractId],
  });
}
