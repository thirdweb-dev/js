import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
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
    name: "publisher",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "contractId",
        type: "string",
      },
      {
        name: "publishTimestamp",
        type: "uint256",
      },
      {
        name: "publishMetadataUri",
        type: "string",
      },
      {
        name: "bytecodeHash",
        type: "bytes32",
      },
      {
        name: "implementation",
        type: "address",
      },
    ],
    name: "published",
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getAllPublishedContracts` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllPublishedContracts` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetAllPublishedContractsSupported } from "thirdweb/extensions/thirdweb";
 * const supported = isGetAllPublishedContractsSupported(["0x..."]);
 * ```
 */
export function isGetAllPublishedContractsSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAllPublishedContracts" function.
 * @param options - The options for the getAllPublishedContracts function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetAllPublishedContractsParams } from "thirdweb/extensions/thirdweb";
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
 * Encodes the "getAllPublishedContracts" function into a Hex string with its parameters.
 * @param options - The options for the getAllPublishedContracts function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetAllPublishedContracts } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetAllPublishedContracts({
 *  publisher: ...,
 * });
 * ```
 */
export function encodeGetAllPublishedContracts(
  options: GetAllPublishedContractsParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAllPublishedContractsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAllPublishedContracts function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetAllPublishedContractsResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetAllPublishedContractsResultResult("...");
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
 *  contract,
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
