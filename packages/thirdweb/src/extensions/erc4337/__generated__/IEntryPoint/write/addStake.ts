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
 * Represents the parameters for the "addStake" function.
 */
export type AddStakeParams = WithOverrides<{
  unstakeDelaySec: AbiParameterToPrimitiveType<{
    type: "uint32";
    name: "_unstakeDelaySec";
  }>;
}>;

export const FN_SELECTOR = "0x0396cb60" as const;
const FN_INPUTS = [
  {
    name: "_unstakeDelaySec",
    type: "uint32",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `addStake` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `addStake` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isAddStakeSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isAddStakeSupported(["0x..."]);
 * ```
 */
export function isAddStakeSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "addStake" function.
 * @param options - The options for the addStake function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeAddStakeParams } from "thirdweb/extensions/erc4337";
 * const result = encodeAddStakeParams({
 *  unstakeDelaySec: ...,
 * });
 * ```
 */
export function encodeAddStakeParams(options: AddStakeParams) {
  return encodeAbiParameters(FN_INPUTS, [options.unstakeDelaySec]);
}

/**
 * Encodes the "addStake" function into a Hex string with its parameters.
 * @param options - The options for the addStake function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeAddStake } from "thirdweb/extensions/erc4337";
 * const result = encodeAddStake({
 *  unstakeDelaySec: ...,
 * });
 * ```
 */
export function encodeAddStake(options: AddStakeParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAddStakeParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "addStake" function on the contract.
 * @param options - The options for the "addStake" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { addStake } from "thirdweb/extensions/erc4337";
 *
 * const transaction = addStake({
 *  contract,
 *  unstakeDelaySec: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function addStake(
  options: BaseTransactionOptions<
    | AddStakeParams
    | {
        asyncParams: () => Promise<AddStakeParams>;
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
      return [resolvedOptions.unstakeDelaySec] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
