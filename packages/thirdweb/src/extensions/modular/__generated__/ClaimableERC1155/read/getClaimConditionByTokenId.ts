import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getClaimConditionByTokenId" function.
 */
export type GetClaimConditionByTokenIdParams = {
  id: AbiParameterToPrimitiveType<{
    name: "_id";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0x29a20bf4" as const;
const FN_INPUTS = [
  {
    name: "_id",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "claimCondition",
    type: "tuple",
    internalType: "struct ClaimableERC1155.ClaimCondition",
    components: [
      {
        name: "availableSupply",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "allowlistMerkleRoot",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "pricePerUnit",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "currency",
        type: "address",
        internalType: "address",
      },
      {
        name: "startTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
      {
        name: "endTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
      {
        name: "auxData",
        type: "string",
        internalType: "string",
      },
    ],
  },
] as const;

/**
 * Checks if the `getClaimConditionByTokenId` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getClaimConditionByTokenId` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetClaimConditionByTokenIdSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isGetClaimConditionByTokenIdSupported(["0x..."]);
 * ```
 */
export function isGetClaimConditionByTokenIdSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getClaimConditionByTokenId" function.
 * @param options - The options for the getClaimConditionByTokenId function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeGetClaimConditionByTokenIdParams } "thirdweb/extensions/modular";
 * const result = encodeGetClaimConditionByTokenIdParams({
 *  id: ...,
 * });
 * ```
 */
export function encodeGetClaimConditionByTokenIdParams(
  options: GetClaimConditionByTokenIdParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.id]);
}

/**
 * Encodes the "getClaimConditionByTokenId" function into a Hex string with its parameters.
 * @param options - The options for the getClaimConditionByTokenId function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeGetClaimConditionByTokenId } "thirdweb/extensions/modular";
 * const result = encodeGetClaimConditionByTokenId({
 *  id: ...,
 * });
 * ```
 */
export function encodeGetClaimConditionByTokenId(
  options: GetClaimConditionByTokenIdParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetClaimConditionByTokenIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getClaimConditionByTokenId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetClaimConditionByTokenIdResult } from "thirdweb/extensions/modular";
 * const result = decodeGetClaimConditionByTokenIdResult("...");
 * ```
 */
export function decodeGetClaimConditionByTokenIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getClaimConditionByTokenId" function on the contract.
 * @param options - The options for the getClaimConditionByTokenId function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getClaimConditionByTokenId } from "thirdweb/extensions/modular";
 *
 * const result = await getClaimConditionByTokenId({
 *  contract,
 *  id: ...,
 * });
 *
 * ```
 */
export async function getClaimConditionByTokenId(
  options: BaseTransactionOptions<GetClaimConditionByTokenIdParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.id],
  });
}
