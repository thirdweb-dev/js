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
 * Represents the parameters for the "getSenderAddress" function.
 */
export type GetSenderAddressParams = WithOverrides<{
  initCode: AbiParameterToPrimitiveType<{ type: "bytes"; name: "initCode" }>;
}>;

export const FN_SELECTOR = "0x9b249f69" as const;
const FN_INPUTS = [
  {
    type: "bytes",
    name: "initCode",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `getSenderAddress` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getSenderAddress` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetSenderAddressSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isGetSenderAddressSupported(contract);
 * ```
 */
export async function isGetSenderAddressSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getSenderAddress" function.
 * @param options - The options for the getSenderAddress function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetSenderAddressParams } "thirdweb/extensions/erc4337";
 * const result = encodeGetSenderAddressParams({
 *  initCode: ...,
 * });
 * ```
 */
export function encodeGetSenderAddressParams(options: GetSenderAddressParams) {
  return encodeAbiParameters(FN_INPUTS, [options.initCode]);
}

/**
 * Encodes the "getSenderAddress" function into a Hex string with its parameters.
 * @param options - The options for the getSenderAddress function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetSenderAddress } "thirdweb/extensions/erc4337";
 * const result = encodeGetSenderAddress({
 *  initCode: ...,
 * });
 * ```
 */
export function encodeGetSenderAddress(options: GetSenderAddressParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetSenderAddressParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "getSenderAddress" function on the contract.
 * @param options - The options for the "getSenderAddress" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getSenderAddress } from "thirdweb/extensions/erc4337";
 *
 * const transaction = getSenderAddress({
 *  contract,
 *  initCode: ...,
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
export function getSenderAddress(
  options: BaseTransactionOptions<
    | GetSenderAddressParams
    | {
        asyncParams: () => Promise<GetSenderAddressParams>;
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
      return [resolvedOptions.initCode] as const;
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
