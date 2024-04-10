import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "recover" function.
 */
export type RecoverParams = WithOverrides<{
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
}>;

export const FN_SELECTOR = "0x2a42ede3" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "from",
  },
  {
    type: "address",
    name: "to",
  },
  {
    type: "uint256",
    name: "deadline",
  },
  {
    type: "bytes",
    name: "sig",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "recover" function.
 * @param options - The options for the recover function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRecoverParams } "thirdweb/extensions/farcaster";
 * const result = encodeRecoverParams({
 *  from: ...,
 *  to: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeRecoverParams(options: RecoverParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.deadline,
    options.sig,
  ]);
}

/**
 * Calls the "recover" function on the contract.
 * @param options - The options for the "recover" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { recover } from "thirdweb/extensions/farcaster";
 *
 * const transaction = recover({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function recover(
  options: BaseTransactionOptions<
    | RecoverParams
    | {
        asyncParams: () => Promise<RecoverParams>;
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
        resolvedOptions.from,
        resolvedOptions.to,
        resolvedOptions.deadline,
        resolvedOptions.sig,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
