import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setClaimConditions" function.
 */
export type SetClaimConditionsParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  phase: AbiParameterToPrimitiveType<{
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
    internalType: "struct IClaimCondition.ClaimCondition";
    name: "phase";
    type: "tuple";
  }>;
  resetClaimEligibility: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "resetClaimEligibility";
    type: "bool";
  }>;
};

/**
 * Calls the "setClaimConditions" function on the contract.
 * @param options - The options for the "setClaimConditions" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { setClaimConditions } from "thirdweb/extensions/erc1155";
 *
 * const transaction = setClaimConditions({
 *  tokenId: ...,
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
  options: BaseTransactionOptions<SetClaimConditionsParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x8affb89f",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
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
          internalType: "struct IClaimCondition.ClaimCondition",
          name: "phase",
          type: "tuple",
        },
        {
          internalType: "bool",
          name: "resetClaimEligibility",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.tokenId, options.phase, options.resetClaimEligibility],
  });
}
