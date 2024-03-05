import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setClaimConditions" function.
 */
export type SetClaimConditionsParams = {
  phases: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "uint256"; name: "startTimestamp"; type: "uint256" },
      { internalType: "uint256"; name: "maxClaimableSupply"; type: "uint256" },
      { internalType: "uint256"; name: "supplyClaimed"; type: "uint256" },
      {
        internalType: "uint256";
        name: "quantityLimitPerWallet";
        type: "uint256";
      },
      {
        internalType: "uint256";
        name: "waitTimeInSecondsBetweenClaims";
        type: "uint256";
      },
      { internalType: "bytes32"; name: "merkleRoot"; type: "bytes32" },
      { internalType: "uint256"; name: "pricePerToken"; type: "uint256" },
      { internalType: "address"; name: "currency"; type: "address" },
    ];
    internalType: "struct IDropClaimCondition.ClaimCondition[]";
    name: "phases";
    type: "tuple[]";
  }>;
  resetClaimEligibility: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "resetClaimEligibility";
    type: "bool";
  }>;
};

/**
 * Calls the setClaimConditions function on the contract.
 * @param options - The options for the setClaimConditions function.
 * @returns A prepared transaction object.
 * @extension IDROPERC20
 * @example
 * ```
 * import { setClaimConditions } from "thirdweb/extensions/IDropERC20";
 *
 * const transaction = setClaimConditions({
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
  options: BaseTransactionOptions<SetClaimConditionsParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xe23b8164",
      [
        {
          components: [
            {
              internalType: "uint256",
              name: "startTimestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxClaimableSupply",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "supplyClaimed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantityLimitPerWallet",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "waitTimeInSecondsBetweenClaims",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "merkleRoot",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "pricePerToken",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
          ],
          internalType: "struct IDropClaimCondition.ClaimCondition[]",
          name: "phases",
          type: "tuple[]",
        },
        {
          internalType: "bool",
          name: "resetClaimEligibility",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.phases, options.resetClaimEligibility],
  });
}
