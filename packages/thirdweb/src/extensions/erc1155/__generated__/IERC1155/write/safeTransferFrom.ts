import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */

export type SafeTransferFromParams = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "_from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "_to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_value" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
};

export const FN_SELECTOR = "0xf242432a" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "safeTransferFrom" function.
 * @param options - The options for the safeTransferFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSafeTransferFromParams } "thirdweb/extensions/erc1155";
 * const result = encodeSafeTransferFromParams({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 *  value: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeSafeTransferFromParams(options: SafeTransferFromParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.tokenId,
    options.value,
    options.data,
  ]);
}

/**
 * Calls the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { safeTransferFrom } from "thirdweb/extensions/erc1155";
 *
 * const transaction = safeTransferFrom({
 *  contract,
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
  options: BaseTransactionOptions<
    | SafeTransferFromParams
    | {
        asyncParams: () => Promise<SafeTransferFromParams>;
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
