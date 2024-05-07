import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
    type: "uint8",
    name: "mode",
  },
  {
    type: "bytes",
    name: "context",
  },
  {
    type: "uint256",
    name: "actualGasCost",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `postOp` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `postOp` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isPostOpSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isPostOpSupported(contract);
 * ```
 */
export async function isPostOpSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
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
 * import { encodePostOpParams } "thirdweb/extensions/erc4337";
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
 * import { encodePostOp } "thirdweb/extensions/erc4337";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.mode,
        resolvedOptions.context,
        resolvedOptions.actualGasCost,
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
  });
}
