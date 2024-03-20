import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "transferFrom" function.
 */

type TransferFromParamsInternal = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export type TransferFromParams = Prettify<
  | TransferFromParamsInternal
  | {
      asyncParams: () => Promise<TransferFromParamsInternal>;
    }
>;
const FN_SELECTOR = "0x23b872dd" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "from",
  },
  {
    type: "address",
    name: "to",
  },
  {
    type: "uint256",
    name: "tokenId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "transferFrom" function.
 * @param options - The options for the transferFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```
 * import { encodeTransferFromParams } "thirdweb/extensions/erc721";
 * const result = encodeTransferFromParams({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeTransferFromParams(options: TransferFromParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.tokenId,
  ]);
}

/**
 * Calls the "transferFrom" function on the contract.
 * @param options - The options for the "transferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { transferFrom } from "thirdweb/extensions/erc721";
 *
 * const transaction = transferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferFrom(
  options: BaseTransactionOptions<TransferFromParams>,
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
            ] as const;
          }
        : [options.from, options.to, options.tokenId],
  });
}
