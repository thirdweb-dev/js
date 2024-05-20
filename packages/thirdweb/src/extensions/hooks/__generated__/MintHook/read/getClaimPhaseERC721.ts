import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getClaimPhaseERC721" function.
 */
export type GetClaimPhaseERC721Params = {
  token: AbiParameterToPrimitiveType<{
    name: "_token";
    type: "address";
    internalType: "address";
  }>;
};

const FN_SELECTOR = "0xbe906827" as const;
const FN_INPUTS = [
  {
    name: "_token",
    type: "address",
    internalType: "address",
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
 * Encodes the parameters for the "getClaimPhaseERC721" function.
 * @param options - The options for the getClaimPhaseERC721 function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeGetClaimPhaseERC721Params } "thirdweb/extensions/hooks";
 * const result = encodeGetClaimPhaseERC721Params({
 *  token: ...,
 * });
 * ```
 */
export function encodeGetClaimPhaseERC721Params(
  options: GetClaimPhaseERC721Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.token]);
}

/**
 * Decodes the result of the getClaimPhaseERC721 function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeGetClaimPhaseERC721Result } from "thirdweb/extensions/hooks";
 * const result = decodeGetClaimPhaseERC721Result("...");
 * ```
 */
export function decodeGetClaimPhaseERC721Result(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getClaimPhaseERC721" function on the contract.
 * @param options - The options for the getClaimPhaseERC721 function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { getClaimPhaseERC721 } from "thirdweb/extensions/hooks";
 *
 * const result = await getClaimPhaseERC721({
 *  token: ...,
 * });
 *
 * ```
 */
export async function getClaimPhaseERC721(
  options: BaseTransactionOptions<GetClaimPhaseERC721Params>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.token],
  });
}
