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
 * Represents the parameters for the "setMaxTotalSupply" function.
 */
export type SetMaxTotalSupplyParams = WithOverrides<{
  maxTotalSupply: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_maxTotalSupply";
  }>;
}>;

export const FN_SELECTOR = "0x3f3e4c11" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_maxTotalSupply",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setMaxTotalSupply` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setMaxTotalSupply` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isSetMaxTotalSupplySupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isSetMaxTotalSupplySupported(contract);
 * ```
 */
export async function isSetMaxTotalSupplySupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setMaxTotalSupply" function.
 * @param options - The options for the setMaxTotalSupply function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetMaxTotalSupplyParams } "thirdweb/extensions/erc721";
 * const result = encodeSetMaxTotalSupplyParams({
 *  maxTotalSupply: ...,
 * });
 * ```
 */
export function encodeSetMaxTotalSupplyParams(
  options: SetMaxTotalSupplyParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.maxTotalSupply]);
}

/**
 * Encodes the "setMaxTotalSupply" function into a Hex string with its parameters.
 * @param options - The options for the setMaxTotalSupply function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetMaxTotalSupply } "thirdweb/extensions/erc721";
 * const result = encodeSetMaxTotalSupply({
 *  maxTotalSupply: ...,
 * });
 * ```
 */
export function encodeSetMaxTotalSupply(options: SetMaxTotalSupplyParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetMaxTotalSupplyParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setMaxTotalSupply" function on the contract.
 * @param options - The options for the "setMaxTotalSupply" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { setMaxTotalSupply } from "thirdweb/extensions/erc721";
 *
 * const transaction = setMaxTotalSupply({
 *  contract,
 *  maxTotalSupply: ...,
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
export function setMaxTotalSupply(
  options: BaseTransactionOptions<
    | SetMaxTotalSupplyParams
    | {
        asyncParams: () => Promise<SetMaxTotalSupplyParams>;
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
      return [resolvedOptions.maxTotalSupply] as const;
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
