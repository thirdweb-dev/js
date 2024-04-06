import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getPublishedContract" function.
 */
export type GetPublishedContractParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    type: "string";
    name: "contractId";
  }>;
};

export const FN_SELECTOR = "0x7ec047fa" as const;
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
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "published",
    components: [
      {
        type: "string",
        name: "contractId",
      },
      {
        type: "uint256",
        name: "publishTimestamp",
      },
      {
        type: "string",
        name: "publishMetadataUri",
      },
      {
        type: "bytes32",
        name: "bytecodeHash",
      },
      {
        type: "address",
        name: "implementation",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "getPublishedContract" function.
 * @param options - The options for the getPublishedContract function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublishedContractParams } "thirdweb/extensions/thirdweb";
 * const result = encodeGetPublishedContractParams({
 *  publisher: ...,
 *  contractId: ...,
 * });
 * ```
 */
export function encodeGetPublishedContractParams(
  options: GetPublishedContractParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.publisher,
    options.contractId,
  ]);
}

/**
 * Decodes the result of the getPublishedContract function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetPublishedContractResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetPublishedContractResult("...");
 * ```
 */
export function decodeGetPublishedContractResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPublishedContract" function on the contract.
 * @param options - The options for the getPublishedContract function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getPublishedContract } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getPublishedContract({
 *  publisher: ...,
 *  contractId: ...,
 * });
 *
 * ```
 */
export async function getPublishedContract(
  options: BaseTransactionOptions<GetPublishedContractParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.publisher, options.contractId],
  });
}
