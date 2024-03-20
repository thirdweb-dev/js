import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "claim" function.
 */

type ClaimParamsInternal = {
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "receiver" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "quantity" }>;
  proofs: AbiParameterToPrimitiveType<{ type: "bytes32[]"; name: "proofs" }>;
  proofMaxQuantityForWallet: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proofMaxQuantityForWallet";
  }>;
};

export type ClaimParams = Prettify<
  | ClaimParamsInternal
  | {
      asyncParams: () => Promise<ClaimParamsInternal>;
    }
>;
/**
 * Calls the "claim" function on the contract.
 * @param options - The options for the "claim" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { claim } from "thirdweb/extensions/erc20";
 *
 * const transaction = claim({
 *  receiver: ...,
 *  quantity: ...,
 *  proofs: ...,
 *  proofMaxQuantityForWallet: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claim(options: BaseTransactionOptions<ClaimParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x3b4b57b0",
      [
        {
          type: "address",
          name: "receiver",
        },
        {
          type: "uint256",
          name: "quantity",
        },
        {
          type: "bytes32[]",
          name: "proofs",
        },
        {
          type: "uint256",
          name: "proofMaxQuantityForWallet",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.receiver,
              resolvedParams.quantity,
              resolvedParams.proofs,
              resolvedParams.proofMaxQuantityForWallet,
            ] as const;
          }
        : [
            options.receiver,
            options.quantity,
            options.proofs,
            options.proofMaxQuantityForWallet,
          ],
  });
}
