import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "transferFrom" function.
 */

export type TransferFromParams = {
  from: AbiParameterToPrimitiveType<{
    name: "_from";
    type: "address";
    internalType: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    name: "_to";
    type: "address";
    internalType: "address";
  }>;
  id: AbiParameterToPrimitiveType<{
    name: "_id";
    type: "uint256";
    internalType: "uint256";
  }>;
};

const FN_SELECTOR = "0x23b872dd" as const;
const FN_INPUTS = [
  {
    name: "_from",
    type: "address",
    internalType: "address",
  },
  {
    name: "_to",
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
 * Encodes the parameters for the "transferFrom" function.
 * @param options - The options for the transferFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTransferFromParams } "thirdweb/extensions/erc721";
 * const result = encodeTransferFromParams({
 *  from: ...,
 *  to: ...,
 *  id: ...,
 * });
 * ```
 */
export function encodeTransferFromParams(options: TransferFromParams) {
  return encodeAbiParameters(FN_INPUTS, [options.from, options.to, options.id]);
}

/**
 * Calls the "transferFrom" function on the contract.
 * @param options - The options for the "transferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { transferFrom } from "thirdweb/extensions/erc721";
 *
 * const transaction = transferFrom({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  id: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferFrom(
  options: BaseTransactionOptions<
    | TransferFromParams
    | {
        asyncParams: () => Promise<TransferFromParams>;
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
              resolvedParams.id,
            ] as const;
          }
        : [options.from, options.to, options.id],
  });
}
