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
 * Represents the parameters for the "burnBatch" function.
 */
export type BurnBatchParams = WithOverrides<{
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
  ids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "ids" }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "values" }>;
}>;

export const FN_SELECTOR = "0x6b20c454" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
  {
    type: "uint256[]",
    name: "ids",
  },
  {
    type: "uint256[]",
    name: "values",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `burnBatch` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `burnBatch` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isBurnBatchSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isBurnBatchSupported(contract);
 * ```
 */
export async function isBurnBatchSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "burnBatch" function.
 * @param options - The options for the burnBatch function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeBurnBatchParams } "thirdweb/extensions/erc1155";
 * const result = encodeBurnBatchParams({
 *  account: ...,
 *  ids: ...,
 *  values: ...,
 * });
 * ```
 */
export function encodeBurnBatchParams(options: BurnBatchParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.account,
    options.ids,
    options.values,
  ]);
}

/**
 * Encodes the "burnBatch" function into a Hex string with its parameters.
 * @param options - The options for the burnBatch function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeBurnBatch } "thirdweb/extensions/erc1155";
 * const result = encodeBurnBatch({
 *  account: ...,
 *  ids: ...,
 *  values: ...,
 * });
 * ```
 */
export function encodeBurnBatch(options: BurnBatchParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBurnBatchParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "burnBatch" function on the contract.
 * @param options - The options for the "burnBatch" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { burnBatch } from "thirdweb/extensions/erc1155";
 *
 * const transaction = burnBatch({
 *  contract,
 *  account: ...,
 *  ids: ...,
 *  values: ...,
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
export function burnBatch(
  options: BaseTransactionOptions<
    | BurnBatchParams
    | {
        asyncParams: () => Promise<BurnBatchParams>;
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
        resolvedOptions.account,
        resolvedOptions.ids,
        resolvedOptions.values,
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
