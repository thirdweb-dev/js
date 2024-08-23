import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "beforeMintERC20" function.
 */
export type BeforeMintERC20Params = WithOverrides<{
  to: AbiParameterToPrimitiveType<{
    name: "_to";
    type: "address";
    internalType: "address";
  }>;
  amount: AbiParameterToPrimitiveType<{
    name: "_amount";
    type: "uint256";
    internalType: "uint256";
  }>;
  data: AbiParameterToPrimitiveType<{
    name: "_data";
    type: "bytes";
    internalType: "bytes";
  }>;
}>;

export const FN_SELECTOR = "0x7ce7cf07" as const;
const FN_INPUTS = [
  {
    name: "_to",
    type: "address",
    internalType: "address",
  },
  {
    name: "_amount",
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
 * Checks if the `beforeMintERC20` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `beforeMintERC20` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isBeforeMintERC20Supported } from "thirdweb/extensions/modular";
 *
 * const supported = isBeforeMintERC20Supported(["0x..."]);
 * ```
 */
export function isBeforeMintERC20Supported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "beforeMintERC20" function.
 * @param options - The options for the beforeMintERC20 function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBeforeMintERC20Params } "thirdweb/extensions/modular";
 * const result = encodeBeforeMintERC20Params({
 *  to: ...,
 *  amount: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBeforeMintERC20Params(options: BeforeMintERC20Params) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.amount,
    options.data,
  ]);
}

/**
 * Encodes the "beforeMintERC20" function into a Hex string with its parameters.
 * @param options - The options for the beforeMintERC20 function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBeforeMintERC20 } "thirdweb/extensions/modular";
 * const result = encodeBeforeMintERC20({
 *  to: ...,
 *  amount: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBeforeMintERC20(options: BeforeMintERC20Params) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBeforeMintERC20Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "beforeMintERC20" function on the contract.
 * @param options - The options for the "beforeMintERC20" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { beforeMintERC20 } from "thirdweb/extensions/modular";
 *
 * const transaction = beforeMintERC20({
 *  contract,
 *  to: ...,
 *  amount: ...,
 *  data: ...,
 *  overrides: {
 *    ...
 *  }
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
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.to,
        resolvedOptions.amount,
        resolvedOptions.data,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
  });
}
