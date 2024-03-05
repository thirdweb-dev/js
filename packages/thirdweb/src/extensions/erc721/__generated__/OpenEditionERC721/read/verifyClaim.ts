import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
  conditionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_conditionId";
  }>;
  claimer: AbiParameterToPrimitiveType<{ type: "address"; name: "_claimer" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_pricePerToken";
  }>;
  allowlistProof: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_allowlistProof";
    components: [
      { type: "bytes32[]"; name: "proof" },
      { type: "uint256"; name: "quantityLimitPerWallet" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
    ];
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
          type: "uint256",
          name: "_conditionId",
        },
        {
          type: "address",
          name: "_claimer",
        },
        {
          type: "uint256",
          name: "_quantity",
        },
        {
          type: "address",
          name: "_currency",
        },
        {
          type: "uint256",
          name: "_pricePerToken",
        },
        {
          type: "tuple",
          name: "_allowlistProof",
          components: [
            {
              type: "bytes32[]",
              name: "proof",
            },
            {
              type: "uint256",
              name: "quantityLimitPerWallet",
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
      ],
      [
        {
          type: "bool",
          name: "isOverride",
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
