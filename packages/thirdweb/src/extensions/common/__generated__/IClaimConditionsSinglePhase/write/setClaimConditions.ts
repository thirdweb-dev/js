import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setClaimConditions" function.
 */

export type SetClaimConditionsParams = {
  phase: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "phase";
    components: [
      { type: "uint256"; name: "startTimestamp" },
      { type: "uint256"; name: "maxClaimableSupply" },
      { type: "uint256"; name: "supplyClaimed" },
      { type: "uint256"; name: "quantityLimitPerWallet" },
      { type: "bytes32"; name: "merkleRoot" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
      { type: "string"; name: "metadata" },
    ];
  }>;
  resetClaimEligibility: AbiParameterToPrimitiveType<{
    type: "bool";
    name: "resetClaimEligibility";
  }>;
};

export const FN_SELECTOR = "0x426cfaf3" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "phase",
    components: [
      {
        type: "uint256",
        name: "startTimestamp",
      },
      {
        type: "uint256",
        name: "maxClaimableSupply",
      },
      {
        type: "uint256",
        name: "supplyClaimed",
      },
      {
        type: "uint256",
        name: "quantityLimitPerWallet",
      },
      {
        type: "bytes32",
        name: "merkleRoot",
      },
      {
        type: "uint256",
        name: "pricePerToken",
      },
      {
        type: "address",
        name: "currency",
      },
      {
        type: "string",
        name: "metadata",
      },
    ],
  },
  {
    type: "bool",
    name: "resetClaimEligibility",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setClaimConditions" function.
 * @param options - The options for the setClaimConditions function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetClaimConditionsParams } "thirdweb/extensions/common";
 * const result = encodeSetClaimConditionsParams({
 *  phase: ...,
 *  resetClaimEligibility: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionsParams(
  options: SetClaimConditionsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.phase,
    options.resetClaimEligibility,
  ]);
}

/**
 * Calls the "setClaimConditions" function on the contract.
 * @param options - The options for the "setClaimConditions" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { setClaimConditions } from "thirdweb/extensions/common";
 *
 * const transaction = setClaimConditions({
 *  contract,
 *  phase: ...,
 *  resetClaimEligibility: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setClaimConditions(
  options: BaseTransactionOptions<
    | SetClaimConditionsParams
    | {
        asyncParams: () => Promise<SetClaimConditionsParams>;
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
            return [
              resolvedParams.phase,
              resolvedParams.resetClaimEligibility,
            ] as const;
          }
        : [options.phase, options.resetClaimEligibility],
  });
}
