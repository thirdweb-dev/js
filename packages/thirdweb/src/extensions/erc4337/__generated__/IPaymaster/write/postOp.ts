import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

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
 * Calls the "postOp" function on the contract.
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
  });
}
