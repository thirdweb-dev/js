import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "claim" function.
 */

export type ClaimParams = {
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "receiver" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "quantity" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  proofs: AbiParameterToPrimitiveType<{ type: "bytes32[]"; name: "proofs" }>;
  proofMaxQuantityForWallet: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proofMaxQuantityForWallet";
  }>;
};

const FN_SELECTOR = "0x38524a10" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "receiver",
  },
  {
    type: "uint256",
    name: "quantity",
  },
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "bytes32[]",
    name: "proofs",
  },
  {
    type: "uint256",
    name: "proofMaxQuantityForWallet",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "claim" function.
 * @param options - The options for the claim function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeClaimParams } "thirdweb/extensions/erc1155";
 * const result = encodeClaimParams({
 *  receiver: ...,
 *  quantity: ...,
 *  tokenId: ...,
 *  proofs: ...,
 *  proofMaxQuantityForWallet: ...,
 * });
 * ```
 */
export function encodeClaimParams(options: ClaimParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.receiver,
    options.quantity,
    options.tokenId,
    options.proofs,
    options.proofMaxQuantityForWallet,
  ]);
}

/**
 * Calls the "claim" function on the contract.
 * @param options - The options for the "claim" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { claim } from "thirdweb/extensions/erc1155";
 *
 * const transaction = claim({
 *  contract,
 *  receiver: ...,
 *  quantity: ...,
 *  tokenId: ...,
 *  proofs: ...,
 *  proofMaxQuantityForWallet: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claim(
  options: BaseTransactionOptions<
    | ClaimParams
    | {
        asyncParams: () => Promise<ClaimParams>;
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
              resolvedParams.receiver,
              resolvedParams.quantity,
              resolvedParams.tokenId,
              resolvedParams.proofs,
              resolvedParams.proofMaxQuantityForWallet,
            ] as const;
          }
        : [
            options.receiver,
            options.quantity,
            options.tokenId,
            options.proofs,
            options.proofMaxQuantityForWallet,
          ],
  });
}
