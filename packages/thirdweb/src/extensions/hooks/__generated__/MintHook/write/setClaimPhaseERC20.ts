import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setClaimPhaseERC20" function.
 */

export type SetClaimPhaseERC20Params = {
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

const FN_SELECTOR = "0x4659f3c0" as const;
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
 * Encodes the parameters for the "setClaimPhaseERC20" function.
 * @param options - The options for the setClaimPhaseERC20 function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeSetClaimPhaseERC20Params } "thirdweb/extensions/hooks";
 * const result = encodeSetClaimPhaseERC20Params({
 *  claimPhase: ...,
 * });
 * ```
 */
export function encodeSetClaimPhaseERC20Params(
  options: SetClaimPhaseERC20Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.claimPhase]);
}

/**
 * Calls the "setClaimPhaseERC20" function on the contract.
 * @param options - The options for the "setClaimPhaseERC20" function.
 * @returns A prepared transaction object.
 * @extension HOOKS
 * @example
 * ```ts
 * import { setClaimPhaseERC20 } from "thirdweb/extensions/hooks";
 *
 * const transaction = setClaimPhaseERC20({
 *  contract,
 *  claimPhase: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setClaimPhaseERC20(
  options: BaseTransactionOptions<
    | SetClaimPhaseERC20Params
    | {
        asyncParams: () => Promise<SetClaimPhaseERC20Params>;
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
