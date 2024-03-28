import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "createPool" function.
 */

type CreatePoolParamsInternal = {
  tokenA: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenA" }>;
  tokenB: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenB" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
};

export type CreatePoolParams = Prettify<
  | CreatePoolParamsInternal
  | {
      asyncParams: () => Promise<CreatePoolParamsInternal>;
    }
>;
const FN_SELECTOR = "0xa1671295" as const;
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
 * ```
 * import { encodeCreatePoolParams } "thirdweb/extensions/uniswap";
 * const result = encodeCreatePoolParams({
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 * ```
 */
export function encodeCreatePoolParams(options: CreatePoolParamsInternal) {
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
 * ```
 * import { createPool } from "thirdweb/extensions/uniswap";
 *
 * const transaction = createPool({
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
export function createPool(options: BaseTransactionOptions<CreatePoolParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.tokenA,
              resolvedParams.tokenB,
              resolvedParams.fee,
            ] as const;
          }
        : [options.tokenA, options.tokenB, options.fee],
  });
}
