import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "claim" function.
 */

type ClaimParamsInternal = {
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "_receiver" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
};

export type ClaimParams = Prettify<
  | ClaimParamsInternal
  | {
      asyncParams: () => Promise<ClaimParamsInternal>;
    }
>;
const METHOD = [
  "0x2bc43fd9",
  [
    {
      type: "address",
      name: "_receiver",
    },
    {
      type: "uint256",
      name: "_tokenId",
    },
    {
      type: "uint256",
      name: "_quantity",
    },
  ],
  [],
] as const;

/**
 * Calls the "claim" function on the contract.
 * @param options - The options for the "claim" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { claim } from "thirdweb/extensions/erc1155";
 *
 * const transaction = claim({
 *  receiver: ...,
 *  tokenId: ...,
 *  quantity: ...,
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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.receiver,
              resolvedParams.tokenId,
              resolvedParams.quantity,
            ] as const;
          }
        : [options.receiver, options.tokenId, options.quantity],
  });
}
