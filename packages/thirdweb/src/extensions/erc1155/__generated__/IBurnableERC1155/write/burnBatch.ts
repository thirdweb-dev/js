import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "burnBatch" function.
 */
export type BurnBatchParams = WithValue<{
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
 * Calls the "burnBatch" function on the contract.
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
      const resolvedParams = await asyncOptions();
      return [
        resolvedParams.account,
        resolvedParams.ids,
        resolvedParams.values,
      ] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
