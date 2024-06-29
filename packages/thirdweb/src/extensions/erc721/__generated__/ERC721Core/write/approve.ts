import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "approve" function.
 */

export type ApproveParams = {
  spender: AbiParameterToPrimitiveType<{
    name: "_spender";
    type: "address";
    internalType: "address";
  }>;
  id: AbiParameterToPrimitiveType<{
    name: "_id";
    type: "uint256";
    internalType: "uint256";
  }>;
};

const FN_SELECTOR = "0x095ea7b3" as const;
const FN_INPUTS = [
  {
    name: "_spender",
    type: "address",
    internalType: "address",
  },
  {
    name: "_id",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "approve" function.
 * @param options - The options for the approve function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeApproveParams } "thirdweb/extensions/erc721";
 * const result = encodeApproveParams({
 *  spender: ...,
 *  id: ...,
 * });
 * ```
 */
export function encodeApproveParams(options: ApproveParams) {
  return encodeAbiParameters(FN_INPUTS, [options.spender, options.id]);
}

/**
 * Calls the "approve" function on the contract.
 * @param options - The options for the "approve" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { approve } from "thirdweb/extensions/erc721";
 *
 * const transaction = approve({
 *  contract,
 *  spender: ...,
 *  id: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approve(
  options: BaseTransactionOptions<
    | ApproveParams
    | {
        asyncParams: () => Promise<ApproveParams>;
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
            return [resolvedParams.spender, resolvedParams.id] as const;
          }
        : [options.spender, options.id],
  });
}
