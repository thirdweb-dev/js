import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setClaimConditions" function.
 */
export type SetClaimConditionsParams = {
  conditions: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "uint256"; name: "startTimestamp"; type: "uint256" },
      { internalType: "uint256"; name: "maxClaimableSupply"; type: "uint256" },
      { internalType: "uint256"; name: "supplyClaimed"; type: "uint256" },
      {
        internalType: "uint256";
        name: "quantityLimitPerWallet";
        type: "uint256";
      },
      { internalType: "bytes32"; name: "merkleRoot"; type: "bytes32" },
      { internalType: "uint256"; name: "pricePerToken"; type: "uint256" },
      { internalType: "address"; name: "currency"; type: "address" },
      { internalType: "string"; name: "metadata"; type: "string" },
    ];
    internalType: "struct IClaimCondition.ClaimCondition[]";
    name: "_conditions";
    type: "tuple[]";
  }>;
  resetClaimEligibility: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "_resetClaimEligibility";
    type: "bool";
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
 *  conditions: ...,
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
      "0x74bc7db7",
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
            {
              internalType: "string",
              name: "metadata",
              type: "string",
            },
          ],
          internalType: "struct IClaimCondition.ClaimCondition[]",
          name: "_conditions",
          type: "tuple[]",
        },
        {
          internalType: "bool",
          name: "_resetClaimEligibility",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.conditions, options.resetClaimEligibility],
  });
}
