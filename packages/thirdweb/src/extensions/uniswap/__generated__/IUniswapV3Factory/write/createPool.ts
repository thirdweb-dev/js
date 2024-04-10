import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "createPool" function.
 */
export type CreatePoolParams = WithValue<{
  tokenA: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenA" }>;
  tokenB: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenB" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
}>;

export const FN_SELECTOR = "0xa1671295" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "tokenA",
  },
  {
    type: "address",
    name: "tokenB",
  },
  {
    type: "uint24",
    name: "fee",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "pool",
  },
] as const;

/**
 * Encodes the parameters for the "createPool" function.
 * @param options - The options for the createPool function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeCreatePoolParams } "thirdweb/extensions/uniswap";
 * const result = encodeCreatePoolParams({
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 * ```
 */
export function encodeCreatePoolParams(options: CreatePoolParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenA,
    options.tokenB,
    options.fee,
  ]);
}

/**
 * Calls the "createPool" function on the contract.
 * @param options - The options for the "createPool" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { createPool } from "thirdweb/extensions/uniswap";
 *
 * const transaction = createPool({
 *  contract,
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createPool(
  options: BaseTransactionOptions<
    | CreatePoolParams
    | {
        asyncParams: () => Promise<CreatePoolParams>;
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
        resolvedParams.tokenA,
        resolvedParams.tokenB,
        resolvedParams.fee,
      ] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
