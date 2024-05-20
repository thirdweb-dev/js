import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "beforeMintERC721" function.
 */

export type BeforeMintERC721Params = {
  to: AbiParameterToPrimitiveType<{
    name: "_to";
    type: "address";
    internalType: "address";
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

const FN_SELECTOR = "0x592394bf" as const;
const FN_INPUTS = [
  {
    name: "_to",
    type: "address",
    internalType: "address",
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
 * Encodes the parameters for the "beforeMintERC721" function.
 * @param options - The options for the beforeMintERC721 function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeBeforeMintERC721Params } "thirdweb/extensions/hooks";
 * const result = encodeBeforeMintERC721Params({
 *  to: ...,
 *  quantity: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBeforeMintERC721Params(options: BeforeMintERC721Params) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.quantity,
    options.data,
  ]);
}

/**
 * Calls the "beforeMintERC721" function on the contract.
 * @param options - The options for the "beforeMintERC721" function.
 * @returns A prepared transaction object.
 * @extension HOOKS
 * @example
 * ```ts
 * import { beforeMintERC721 } from "thirdweb/extensions/hooks";
 *
 * const transaction = beforeMintERC721({
 *  contract,
 *  to: ...,
 *  quantity: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function beforeMintERC721(
  options: BaseTransactionOptions<
    | BeforeMintERC721Params
    | {
        asyncParams: () => Promise<BeforeMintERC721Params>;
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
              resolvedParams.quantity,
              resolvedParams.data,
            ] as const;
          }
        : [options.to, options.quantity, options.data],
  });
}
