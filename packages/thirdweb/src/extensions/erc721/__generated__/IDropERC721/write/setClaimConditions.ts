import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

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

/**
 * Calls the "setClaimConditions" function on the contract.
 * @param options - The options for the "setClaimConditions" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { setClaimConditions } from "thirdweb/extensions/erc721";
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
      ],
      [],
    ],
    params: [options.phases, options.resetClaimEligibility],
  });
}
