import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
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
    name: "from",
    type: "address",
  },
  {
    name: "to",
    type: "address",
  },
  {
    name: "deadline",
    type: "uint256",
  },
  {
    name: "sig",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `recover` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `recover` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isRecoverSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = isRecoverSupported(["0x..."]);
 * ```
 */
export function isRecoverSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "recover" function.
 * @param options - The options for the recover function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRecoverParams } from "thirdweb/extensions/farcaster";
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
 * Encodes the "recover" function into a Hex string with its parameters.
 * @param options - The options for the recover function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRecover } from "thirdweb/extensions/farcaster";
 * const result = encodeRecover({
 *  from: ...,
 *  to: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeRecover(options: RecoverParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRecoverParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "recover" function on the contract.
 * @param options - The options for the "recover" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { recover } from "thirdweb/extensions/farcaster";
 *
 * const transaction = recover({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  deadline: ...,
 *  sig: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
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
