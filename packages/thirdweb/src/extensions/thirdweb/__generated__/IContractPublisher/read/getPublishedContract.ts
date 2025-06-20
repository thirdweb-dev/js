import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
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
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getPublishedContract` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getPublishedContract` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetPublishedContractSupported } from "thirdweb/extensions/thirdweb";
 * const supported = isGetPublishedContractSupported(["0x..."]);
 * ```
 */
export function isGetPublishedContractSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPublishedContract" function.
 * @param options - The options for the getPublishedContract function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublishedContractParams } from "thirdweb/extensions/thirdweb";
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
 * Encodes the "getPublishedContract" function into a Hex string with its parameters.
 * @param options - The options for the getPublishedContract function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublishedContract } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetPublishedContract({
 *  publisher: ...,
 *  contractId: ...,
 * });
 * ```
 */
export function encodeGetPublishedContract(
  options: GetPublishedContractParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPublishedContractParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPublishedContract function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetPublishedContractResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetPublishedContractResultResult("...");
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
 *  contract,
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
