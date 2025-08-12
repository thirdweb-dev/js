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
 * Represents the parameters for the "grantRoles" function.
 */
export type GrantRolesParams = WithOverrides<{
  user: AbiParameterToPrimitiveType<{ type: "address"; name: "user" }>;
  roles: AbiParameterToPrimitiveType<{ type: "uint256"; name: "roles" }>;
}>;

export const FN_SELECTOR = "0x1c10893f" as const;
const FN_INPUTS = [
  {
    name: "user",
    type: "address",
  },
  {
    name: "roles",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `grantRoles` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `grantRoles` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isGrantRolesSupported } from "thirdweb/extensions/modules";
 *
 * const supported = isGrantRolesSupported(["0x..."]);
 * ```
 */
export function isGrantRolesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "grantRoles" function.
 * @param options - The options for the grantRoles function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeGrantRolesParams } from "thirdweb/extensions/modules";
 * const result = encodeGrantRolesParams({
 *  user: ...,
 *  roles: ...,
 * });
 * ```
 */
export function encodeGrantRolesParams(options: GrantRolesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.user, options.roles]);
}

/**
 * Encodes the "grantRoles" function into a Hex string with its parameters.
 * @param options - The options for the grantRoles function.
 * @returns The encoded hexadecimal string.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeGrantRoles } from "thirdweb/extensions/modules";
 * const result = encodeGrantRoles({
 *  user: ...,
 *  roles: ...,
 * });
 * ```
 */
export function encodeGrantRoles(options: GrantRolesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGrantRolesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "grantRoles" function on the contract.
 * @param options - The options for the "grantRoles" function.
 * @returns A prepared transaction object.
 * @extension MODULES
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { grantRoles } from "thirdweb/extensions/modules";
 *
 * const transaction = grantRoles({
 *  contract,
 *  user: ...,
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
export function grantRoles(
  options: BaseTransactionOptions<
    | GrantRolesParams
    | {
        asyncParams: () => Promise<GrantRolesParams>;
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
      return [resolvedOptions.user, resolvedOptions.roles] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
