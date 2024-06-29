import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setClaimPhaseERC721" function.
 */

export type SetClaimPhaseERC721Params = {
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

const FN_SELECTOR = "0x12869c58" as const;
const FN_INPUTS = [
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
 * Encodes the parameters for the "setClaimPhaseERC721" function.
 * @param options - The options for the setClaimPhaseERC721 function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeSetClaimPhaseERC721Params } "thirdweb/extensions/hooks";
 * const result = encodeSetClaimPhaseERC721Params({
 *  claimPhase: ...,
 * });
 * ```
 */
export function encodeSetClaimPhaseERC721Params(
  options: SetClaimPhaseERC721Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.claimPhase]);
}

/**
 * Calls the "setClaimPhaseERC721" function on the contract.
 * @param options - The options for the "setClaimPhaseERC721" function.
 * @returns A prepared transaction object.
 * @extension HOOKS
 * @example
 * ```ts
 * import { setClaimPhaseERC721 } from "thirdweb/extensions/hooks";
 *
 * const transaction = setClaimPhaseERC721({
 *  contract,
 *  claimPhase: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setClaimPhaseERC721(
  options: BaseTransactionOptions<
    | SetClaimPhaseERC721Params
    | {
        asyncParams: () => Promise<SetClaimPhaseERC721Params>;
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
            return [resolvedParams.claimPhase] as const;
          }
        : [options.claimPhase],
  });
}
