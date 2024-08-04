import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setClaimPhaseERC1155" function.
 */

export type SetClaimPhaseERC1155Params = {
  id: AbiParameterToPrimitiveType<{
    name: "_id";
    type: "uint256";
    internalType: "uint256";
  }>;
  claimPhase: AbiParameterToPrimitiveType<{
    name: "_claimPhase";
    type: "tuple";
    internalType: "struct MintHook.ClaimPhase";
    components: [
      { name: "availableSupply"; type: "uint256"; internalType: "uint256" },
      { name: "allowlistMerkleRoot"; type: "bytes32"; internalType: "bytes32" },
      { name: "pricePerUnit"; type: "uint256"; internalType: "uint256" },
      { name: "currency"; type: "address"; internalType: "address" },
      { name: "startTimestamp"; type: "uint48"; internalType: "uint48" },
      { name: "endTimestamp"; type: "uint48"; internalType: "uint48" },
    ];
  }>;
};

const FN_SELECTOR = "0x1ff71e06" as const;
const FN_INPUTS = [
  {
    name: "_id",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_claimPhase",
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
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setClaimPhaseERC1155" function.
 * @param options - The options for the setClaimPhaseERC1155 function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeSetClaimPhaseERC1155Params } "thirdweb/extensions/hooks";
 * const result = encodeSetClaimPhaseERC1155Params({
 *  id: ...,
 *  claimPhase: ...,
 * });
 * ```
 */
export function encodeSetClaimPhaseERC1155Params(
  options: SetClaimPhaseERC1155Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.id, options.claimPhase]);
}

/**
 * Calls the "setClaimPhaseERC1155" function on the contract.
 * @param options - The options for the "setClaimPhaseERC1155" function.
 * @returns A prepared transaction object.
 * @extension HOOKS
 * @example
 * ```ts
 * import { setClaimPhaseERC1155 } from "thirdweb/extensions/hooks";
 *
 * const transaction = setClaimPhaseERC1155({
 *  contract,
 *  id: ...,
 *  claimPhase: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setClaimPhaseERC1155(
  options: BaseTransactionOptions<
    | SetClaimPhaseERC1155Params
    | {
        asyncParams: () => Promise<SetClaimPhaseERC1155Params>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.id, resolvedParams.claimPhase] as const;
          }
        : [options.id, options.claimPhase],
  });
}
