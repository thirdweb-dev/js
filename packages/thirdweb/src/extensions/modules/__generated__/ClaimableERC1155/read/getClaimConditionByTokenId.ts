import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getClaimConditionByTokenId" function.
 */
export type GetClaimConditionByTokenIdParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x29a20bf4" as const;
const FN_INPUTS = [
  {
    name: "tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "availableSupply",
        type: "uint256",
      },
      {
        name: "allowlistMerkleRoot",
        type: "bytes32",
      },
      {
        name: "pricePerUnit",
        type: "uint256",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "maxMintPerWallet",
        type: "uint256",
      },
      {
        name: "startTimestamp",
        type: "uint48",
      },
      {
        name: "endTimestamp",
        type: "uint48",
      },
      {
        name: "auxData",
        type: "string",
      },
    ],
    name: "claimCondition",
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getClaimConditionByTokenId` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getClaimConditionByTokenId` method is supported.
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 * const supported = ClaimableERC1155.isGetClaimConditionByTokenIdSupported(["0x..."]);
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
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 * const result = ClaimableERC1155.encodeGetClaimConditionByTokenIdParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetClaimConditionByTokenIdParams(
  options: GetClaimConditionByTokenIdParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "getClaimConditionByTokenId" function into a Hex string with its parameters.
 * @param options - The options for the getClaimConditionByTokenId function.
 * @returns The encoded hexadecimal string.
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 * const result = ClaimableERC1155.encodeGetClaimConditionByTokenId({
 *  tokenId: ...,
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
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 * const result = ClaimableERC1155.decodeGetClaimConditionByTokenIdResultResult("...");
 * ```
 */
export function decodeGetClaimConditionByTokenIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getClaimConditionByTokenId" function on the contract.
 * @param options - The options for the getClaimConditionByTokenId function.
 * @returns The parsed result of the function call.
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 *
 * const result = await ClaimableERC1155.getClaimConditionByTokenId({
 *  contract,
 *  tokenId: ...,
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
    params: [options.tokenId],
  });
}
