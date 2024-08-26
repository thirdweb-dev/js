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
 * Represents the parameters for the "setTransferValidator" function.
 */
export type SetTransferValidatorParams = WithOverrides<{
  validator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "validator";
  }>;
}>;

export const FN_SELECTOR = "0xa9fc664e" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "validator",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setTransferValidator` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setTransferValidator` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isSetTransferValidatorSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isSetTransferValidatorSupported(contract);
 * ```
 */
export async function isSetTransferValidatorSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setTransferValidator" function.
 * @param options - The options for the setTransferValidator function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetTransferValidatorParams } "thirdweb/extensions/modular";
 * const result = encodeSetTransferValidatorParams({
 *  validator: ...,
 * });
 * ```
 */
export function encodeSetTransferValidatorParams(
  options: SetTransferValidatorParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.validator]);
}

/**
 * Encodes the "setTransferValidator" function into a Hex string with its parameters.
 * @param options - The options for the setTransferValidator function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetTransferValidator } "thirdweb/extensions/modular";
 * const result = encodeSetTransferValidator({
 *  validator: ...,
 * });
 * ```
 */
export function encodeSetTransferValidator(
  options: SetTransferValidatorParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetTransferValidatorParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setTransferValidator" function on the contract.
 * @param options - The options for the "setTransferValidator" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { setTransferValidator } from "thirdweb/extensions/modular";
 *
 * const transaction = setTransferValidator({
 *  contract,
 *  validator: ...,
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
export function setTransferValidator(
  options: BaseTransactionOptions<
    | SetTransferValidatorParams
    | {
        asyncParams: () => Promise<SetTransferValidatorParams>;
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
      return [resolvedOptions.validator] as const;
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
