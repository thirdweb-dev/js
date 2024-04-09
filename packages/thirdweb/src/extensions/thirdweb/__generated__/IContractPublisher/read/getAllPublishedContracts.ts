import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAllPublishedContracts" function.
 */
export type GetAllPublishedContractsParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
};

export const FN_SELECTOR = "0xaf8db690" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "publisher",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
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
 * Encodes the parameters for the "getAllPublishedContracts" function.
 * @param options - The options for the getAllPublishedContracts function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetAllPublishedContractsParams } "thirdweb/extensions/thirdweb";
 * const result = encodeGetAllPublishedContractsParams({
 *  publisher: ...,
 * });
 * ```
 */
export function encodeGetAllPublishedContractsParams(
  options: GetAllPublishedContractsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.publisher]);
}

/**
 * Decodes the result of the getAllPublishedContracts function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetAllPublishedContractsResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetAllPublishedContractsResult("...");
 * ```
 */
export function decodeGetAllPublishedContractsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllPublishedContracts" function on the contract.
 * @param options - The options for the getAllPublishedContracts function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getAllPublishedContracts } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getAllPublishedContracts({
 *  publisher: ...,
 * });
 *
 * ```
 */
export async function getAllPublishedContracts(
  options: BaseTransactionOptions<GetAllPublishedContractsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.publisher],
  });
}
