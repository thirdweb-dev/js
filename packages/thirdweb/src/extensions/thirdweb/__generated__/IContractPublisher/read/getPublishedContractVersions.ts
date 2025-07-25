import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getPublishedContractVersions" function.
 */
export type GetPublishedContractVersionsParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    type: "string";
    name: "contractId";
  }>;
};

export const FN_SELECTOR = "0x80251dac" as const;
const FN_INPUTS = [
  {
    name: "publisher",
    type: "address",
  },
  {
    name: "contractId",
    type: "string",
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
 * Checks if the `getPublishedContractVersions` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getPublishedContractVersions` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetPublishedContractVersionsSupported } from "thirdweb/extensions/thirdweb";
 * const supported = isGetPublishedContractVersionsSupported(["0x..."]);
 * ```
 */
export function isGetPublishedContractVersionsSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPublishedContractVersions" function.
 * @param options - The options for the getPublishedContractVersions function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublishedContractVersionsParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetPublishedContractVersionsParams({
 *  publisher: ...,
 *  contractId: ...,
 * });
 * ```
 */
export function encodeGetPublishedContractVersionsParams(
  options: GetPublishedContractVersionsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.publisher,
    options.contractId,
  ]);
}

/**
 * Encodes the "getPublishedContractVersions" function into a Hex string with its parameters.
 * @param options - The options for the getPublishedContractVersions function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublishedContractVersions } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetPublishedContractVersions({
 *  publisher: ...,
 *  contractId: ...,
 * });
 * ```
 */
export function encodeGetPublishedContractVersions(
  options: GetPublishedContractVersionsParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPublishedContractVersionsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPublishedContractVersions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetPublishedContractVersionsResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetPublishedContractVersionsResultResult("...");
 * ```
 */
export function decodeGetPublishedContractVersionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPublishedContractVersions" function on the contract.
 * @param options - The options for the getPublishedContractVersions function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getPublishedContractVersions } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getPublishedContractVersions({
 *  contract,
 *  publisher: ...,
 *  contractId: ...,
 * });
 *
 * ```
 */
export async function getPublishedContractVersions(
  options: BaseTransactionOptions<GetPublishedContractVersionsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.publisher, options.contractId],
  });
}
