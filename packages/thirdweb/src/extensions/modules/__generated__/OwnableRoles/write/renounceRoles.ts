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
 * Represents the parameters for the "renounceRoles" function.
 */
export type RenounceRolesParams = WithOverrides<{
  roles: AbiParameterToPrimitiveType<{ type: "uint256"; name: "roles" }>;
}>;

export const FN_SELECTOR = "0x183a4f6e" as const;
const FN_INPUTS = [
  {
    name: "roles",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `renounceRoles` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `renounceRoles` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isRenounceRolesSupported } from "thirdweb/extensions/modules";
 *
 * const supported = isRenounceRolesSupported(["0x..."]);
 * ```
 */
export function isRenounceRolesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "renounceRoles" function.
 * @param options - The options for the renounceRoles function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeRenounceRolesParams } from "thirdweb/extensions/modules";
 * const result = encodeRenounceRolesParams({
 *  roles: ...,
 * });
 * ```
 */
export function encodeRenounceRolesParams(options: RenounceRolesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.roles]);
}

/**
 * Encodes the "renounceRoles" function into a Hex string with its parameters.
 * @param options - The options for the renounceRoles function.
 * @returns The encoded hexadecimal string.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeRenounceRoles } from "thirdweb/extensions/modules";
 * const result = encodeRenounceRoles({
 *  roles: ...,
 * });
 * ```
 */
export function encodeRenounceRoles(options: RenounceRolesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRenounceRolesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "renounceRoles" function on the contract.
 * @param options - The options for the "renounceRoles" function.
 * @returns A prepared transaction object.
 * @extension MODULES
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { renounceRoles } from "thirdweb/extensions/modules";
 *
 * const transaction = renounceRoles({
 *  contract,
 *  roles: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function renounceRoles(
  options: BaseTransactionOptions<
    | RenounceRolesParams
    | {
        asyncParams: () => Promise<RenounceRolesParams>;
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
      return [resolvedOptions.roles] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
