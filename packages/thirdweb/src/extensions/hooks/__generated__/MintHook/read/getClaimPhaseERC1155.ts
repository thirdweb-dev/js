import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getClaimPhaseERC1155" function.
 */
export type GetClaimPhaseERC1155Params = {
  token: AbiParameterToPrimitiveType<{
    name: "_token";
    type: "address";
    internalType: "address";
  }>;
  id: AbiParameterToPrimitiveType<{
    name: "_id";
    type: "uint256";
    internalType: "uint256";
  }>;
};

const FN_SELECTOR = "0x2e40479a" as const;
const FN_INPUTS = [
  {
    name: "_token",
    type: "address",
    internalType: "address",
  },
  {
    name: "_id",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "claimPhase",
    type: "tuple",
    internalType: "struct MintHook.ClaimPhase",
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
    ],
  },
] as const;

/**
 * Encodes the parameters for the "getClaimPhaseERC1155" function.
 * @param options - The options for the getClaimPhaseERC1155 function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeGetClaimPhaseERC1155Params } "thirdweb/extensions/hooks";
 * const result = encodeGetClaimPhaseERC1155Params({
 *  token: ...,
 *  id: ...,
 * });
 * ```
 */
export function encodeGetClaimPhaseERC1155Params(
  options: GetClaimPhaseERC1155Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.token, options.id]);
}

/**
 * Decodes the result of the getClaimPhaseERC1155 function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeGetClaimPhaseERC1155Result } from "thirdweb/extensions/hooks";
 * const result = decodeGetClaimPhaseERC1155Result("...");
 * ```
 */
export function decodeGetClaimPhaseERC1155Result(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getClaimPhaseERC1155" function on the contract.
 * @param options - The options for the getClaimPhaseERC1155 function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { getClaimPhaseERC1155 } from "thirdweb/extensions/hooks";
 *
 * const result = await getClaimPhaseERC1155({
 *  token: ...,
 *  id: ...,
 * });
 *
 * ```
 */
export async function getClaimPhaseERC1155(
  options: BaseTransactionOptions<GetClaimPhaseERC1155Params>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.token, options.id],
  });
}
