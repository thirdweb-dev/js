import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "beforeMintERC1155" function.
 */

export type BeforeMintERC1155Params = {
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
  quantity: AbiParameterToPrimitiveType<{
    name: "_quantity";
    type: "uint256";
    internalType: "uint256";
  }>;
  data: AbiParameterToPrimitiveType<{
    name: "_data";
    type: "bytes";
    internalType: "bytes";
  }>;
};

const FN_SELECTOR = "0x1e1dcb18" as const;
const FN_INPUTS = [
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
  {
    name: "_quantity",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_data",
    type: "bytes",
    internalType: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "bytes",
    internalType: "bytes",
  },
] as const;

/**
 * Encodes the parameters for the "beforeMintERC1155" function.
 * @param options - The options for the beforeMintERC1155 function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeBeforeMintERC1155Params } "thirdweb/extensions/hooks";
 * const result = encodeBeforeMintERC1155Params({
 *  to: ...,
 *  id: ...,
 *  quantity: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBeforeMintERC1155Params(
  options: BeforeMintERC1155Params,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.id,
    options.quantity,
    options.data,
  ]);
}

/**
 * Calls the "beforeMintERC1155" function on the contract.
 * @param options - The options for the "beforeMintERC1155" function.
 * @returns A prepared transaction object.
 * @extension HOOKS
 * @example
 * ```ts
 * import { beforeMintERC1155 } from "thirdweb/extensions/hooks";
 *
 * const transaction = beforeMintERC1155({
 *  contract,
 *  to: ...,
 *  id: ...,
 *  quantity: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function beforeMintERC1155(
  options: BaseTransactionOptions<
    | BeforeMintERC1155Params
    | {
        asyncParams: () => Promise<BeforeMintERC1155Params>;
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
              resolvedParams.to,
              resolvedParams.id,
              resolvedParams.quantity,
              resolvedParams.data,
            ] as const;
          }
        : [options.to, options.id, options.quantity, options.data],
  });
}
