import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "postOp" function.
 */
export type PostOpParams = WithOverrides<{
  mode: AbiParameterToPrimitiveType<{ type: "uint8"; name: "mode" }>;
  context: AbiParameterToPrimitiveType<{ type: "bytes"; name: "context" }>;
  actualGasCost: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "actualGasCost";
  }>;
}>;

export const FN_SELECTOR = "0xa9a23409" as const;
const FN_INPUTS = [
  {
    name: "mode",
    type: "uint8",
  },
  {
    name: "context",
    type: "bytes",
  },
  {
    name: "actualGasCost",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `postOp` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `postOp` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isPostOpSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isPostOpSupported(["0x..."]);
 * ```
 */
export function isPostOpSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "postOp" function.
 * @param options - The options for the postOp function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodePostOpParams } from "thirdweb/extensions/erc4337";
 * const result = encodePostOpParams({
 *  mode: ...,
 *  context: ...,
 *  actualGasCost: ...,
 * });
 * ```
 */
export function encodePostOpParams(options: PostOpParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.mode,
    options.context,
    options.actualGasCost,
  ]);
}

/**
 * Encodes the "postOp" function into a Hex string with its parameters.
 * @param options - The options for the postOp function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodePostOp } from "thirdweb/extensions/erc4337";
 * const result = encodePostOp({
 *  mode: ...,
 *  context: ...,
 *  actualGasCost: ...,
 * });
 * ```
 */
export function encodePostOp(options: PostOpParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePostOpParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "postOp" function on the contract.
 * @param options - The options for the "postOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { postOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = postOp({
 *  contract,
 *  mode: ...,
 *  context: ...,
 *  actualGasCost: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function postOp(
  options: BaseTransactionOptions<
    | PostOpParams
    | {
        asyncParams: () => Promise<PostOpParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.mode,
        resolvedOptions.context,
        resolvedOptions.actualGasCost,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
