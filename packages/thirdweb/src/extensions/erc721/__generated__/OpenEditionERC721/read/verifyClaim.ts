import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
  conditionId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_conditionId";
    type: "uint256";
  }>;
  claimer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_claimer";
    type: "address";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_quantity";
    type: "uint256";
  }>;
  currency: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_currency";
    type: "address";
  }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_pricePerToken";
    type: "uint256";
  }>;
  allowlistProof: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "bytes32[]"; name: "proof"; type: "bytes32[]" },
      {
        internalType: "uint256";
        name: "quantityLimitPerWallet";
        type: "uint256";
      },
      { internalType: "uint256"; name: "pricePerToken"; type: "uint256" },
      { internalType: "address"; name: "currency"; type: "address" },
    ];
    internalType: "struct IDrop.AllowlistProof";
    name: "_allowlistProof";
    type: "tuple";
  }>;
};

/**
 * Calls the "verifyClaim" function on the contract.
 * @param options - The options for the verifyClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { verifyClaim } from "thirdweb/extensions/erc721";
 *
 * const result = await verifyClaim({
 *  conditionId: ...,
 *  claimer: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 * });
 *
 * ```
 */
export async function verifyClaim(
  options: BaseTransactionOptions<VerifyClaimParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x23a2902b",
      [
        {
          internalType: "uint256",
          name: "_conditionId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_claimer",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_currency",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_pricePerToken",
          type: "uint256",
        },
        {
          components: [
            {
              internalType: "bytes32[]",
              name: "proof",
              type: "bytes32[]",
            },
            {
              internalType: "uint256",
              name: "quantityLimitPerWallet",
              type: "uint256",
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
          internalType: "struct IDrop.AllowlistProof",
          name: "_allowlistProof",
          type: "tuple",
        },
      ],
      [
        {
          internalType: "bool",
          name: "isOverride",
          type: "bool",
        },
      ],
    ],
    params: [
      options.conditionId,
      options.claimer,
      options.quantity,
      options.currency,
      options.pricePerToken,
      options.allowlistProof,
    ],
  });
}
