import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setClaimConditions" function.
 */

export type SetClaimConditionsParams = {
  phases: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "phases";
    components: [
      { type: "uint256"; name: "startTimestamp" },
      { type: "uint256"; name: "maxClaimableSupply" },
      { type: "uint256"; name: "supplyClaimed" },
      { type: "uint256"; name: "quantityLimitPerWallet" },
      { type: "uint256"; name: "waitTimeInSecondsBetweenClaims" },
      { type: "bytes32"; name: "merkleRoot" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
    ];
  }>;
  resetClaimEligibility: AbiParameterToPrimitiveType<{
    type: "bool";
    name: "resetClaimEligibility";
  }>;
};

export const FN_SELECTOR = "0xe23b8164" as const;
const FN_INPUTS = [
  {
    type: "tuple[]",
    name: "phases",
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
        type: "uint256",
        name: "waitTimeInSecondsBetweenClaims",
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
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeSetClaimConditionsParams } "thirdweb/extensions/erc20";
 * const result = encodeSetClaimConditionsParams({
 *  phases: ...,
 *  resetClaimEligibility: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionsParams(
  options: SetClaimConditionsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.phases,
    options.resetClaimEligibility,
  ]);
}

/**
 * Calls the "setClaimConditions" function on the contract.
 * @param options - The options for the "setClaimConditions" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { setClaimConditions } from "thirdweb/extensions/erc20";
 *
 * const transaction = setClaimConditions({
 *  contract,
 *  phases: ...,
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
              resolvedParams.phases,
              resolvedParams.resetClaimEligibility,
            ] as const;
          }
        : [options.phases, options.resetClaimEligibility],
  });
}
