import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */

type SafeTransferFromParamsInternal = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "_from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "_to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_value" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
};

export type SafeTransferFromParams = Prettify<
  | SafeTransferFromParamsInternal
  | {
      asyncParams: () => Promise<SafeTransferFromParamsInternal>;
    }
>;
const METHOD = [
  "0xf242432a",
  [
    {
      type: "address",
      name: "_from",
    },
    {
      type: "address",
      name: "_to",
    },
    {
      type: "uint256",
      name: "tokenId",
    },
    {
      type: "uint256",
      name: "_value",
    },
    {
      type: "bytes",
      name: "_data",
    },
  ],
  [],
] as const;

/**
 * Calls the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { safeTransferFrom } from "thirdweb/extensions/erc1155";
 *
 * const transaction = safeTransferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 *  value: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeTransferFrom(
  options: BaseTransactionOptions<SafeTransferFromParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.from,
              resolvedParams.to,
              resolvedParams.tokenId,
              resolvedParams.value,
              resolvedParams.data,
            ] as const;
          }
        : [
            options.from,
            options.to,
            options.tokenId,
            options.value,
            options.data,
          ],
  });
}
