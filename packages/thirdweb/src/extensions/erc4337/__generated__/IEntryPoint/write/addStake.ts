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
    type: "uint32",
    name: "_unstakeDelaySec",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `addStake` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `addStake` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isAddStakeSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isAddStakeSupported(contract);
 * ```
 */
export async function isAddStakeSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
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
 * import { encodeAddStakeParams } "thirdweb/extensions/erc4337";
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
 * import { encodeAddStake } "thirdweb/extensions/erc4337";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.unstakeDelaySec] as const;
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
