import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "safeBatchTransferFrom" function.
 */

export type SafeBatchTransferFromParams = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "_from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "_to" }>;
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "_values" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
};

export const FN_SELECTOR = "0x2eb2c2d6" as const;
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
    type: "uint256[]",
    name: "tokenIds",
  },
  {
    type: "uint256[]",
    name: "_values",
  },
  {
    type: "bytes",
    name: "_data",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "safeBatchTransferFrom" function.
 * @param options - The options for the safeBatchTransferFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSafeBatchTransferFromParams } "thirdweb/extensions/erc1155";
 * const result = encodeSafeBatchTransferFromParams({
 *  from: ...,
 *  to: ...,
 *  tokenIds: ...,
 *  values: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeSafeBatchTransferFromParams(
  options: SafeBatchTransferFromParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.tokenIds,
    options.values,
    options.data,
  ]);
}

/**
 * Calls the "safeBatchTransferFrom" function on the contract.
 * @param options - The options for the "safeBatchTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { safeBatchTransferFrom } from "thirdweb/extensions/erc1155";
 *
 * const transaction = safeBatchTransferFrom({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  tokenIds: ...,
 *  values: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeBatchTransferFrom(
  options: BaseTransactionOptions<
    | SafeBatchTransferFromParams
    | {
        asyncParams: () => Promise<SafeBatchTransferFromParams>;
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
              resolvedParams.tokenIds,
              resolvedParams.values,
              resolvedParams.data,
            ] as const;
          }
        : [
            options.from,
            options.to,
            options.tokenIds,
            options.values,
            options.data,
          ],
  });
}
