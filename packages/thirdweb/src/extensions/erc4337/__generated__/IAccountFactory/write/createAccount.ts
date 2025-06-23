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
 * Represents the parameters for the "createAccount" function.
 */
export type CreateAccountParams = WithOverrides<{
  admin: AbiParameterToPrimitiveType<{ type: "address"; name: "admin" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
}>;

export const FN_SELECTOR = "0xd8fd8f44" as const;
const FN_INPUTS = [
  {
    name: "admin",
    type: "address",
  },
  {
    name: "_data",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "account",
    type: "address",
  },
] as const;

/**
 * Checks if the `createAccount` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createAccount` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isCreateAccountSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isCreateAccountSupported(["0x..."]);
 * ```
 */
export function isCreateAccountSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createAccount" function.
 * @param options - The options for the createAccount function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeCreateAccountParams } from "thirdweb/extensions/erc4337";
 * const result = encodeCreateAccountParams({
 *  admin: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeCreateAccountParams(options: CreateAccountParams) {
  return encodeAbiParameters(FN_INPUTS, [options.admin, options.data]);
}

/**
 * Encodes the "createAccount" function into a Hex string with its parameters.
 * @param options - The options for the createAccount function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeCreateAccount } from "thirdweb/extensions/erc4337";
 * const result = encodeCreateAccount({
 *  admin: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeCreateAccount(options: CreateAccountParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateAccountParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createAccount" function on the contract.
 * @param options - The options for the "createAccount" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createAccount } from "thirdweb/extensions/erc4337";
 *
 * const transaction = createAccount({
 *  contract,
 *  admin: ...,
 *  data: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function createAccount(
  options: BaseTransactionOptions<
    | CreateAccountParams
    | {
        asyncParams: () => Promise<CreateAccountParams>;
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
      return [resolvedOptions.admin, resolvedOptions.data] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
