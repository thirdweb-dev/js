import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "beforeMintERC20" function.
 */

export type BeforeMintERC20Params = {
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

const FN_SELECTOR = "0x7ce7cf07" as const;
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
 * Encodes the parameters for the "beforeMintERC20" function.
 * @param options - The options for the beforeMintERC20 function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeBeforeMintERC20Params } "thirdweb/extensions/hooks";
 * const result = encodeBeforeMintERC20Params({
 *  to: ...,
 *  quantity: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBeforeMintERC20Params(options: BeforeMintERC20Params) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.quantity,
    options.data,
  ]);
}

/**
 * Calls the "beforeMintERC20" function on the contract.
 * @param options - The options for the "beforeMintERC20" function.
 * @returns A prepared transaction object.
 * @extension HOOKS
 * @example
 * ```ts
 * import { beforeMintERC20 } from "thirdweb/extensions/hooks";
 *
 * const transaction = beforeMintERC20({
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
export function beforeMintERC20(
  options: BaseTransactionOptions<
    | BeforeMintERC20Params
    | {
        asyncParams: () => Promise<BeforeMintERC20Params>;
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
