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
 * Represents the parameters for the "grantRoles" function.
 */
export type GrantRolesParams = WithOverrides<{
  user: AbiParameterToPrimitiveType<{
    name: "user";
    type: "address";
    internalType: "address";
  }>;
  roles: AbiParameterToPrimitiveType<{
    name: "roles";
    type: "uint256";
    internalType: "uint256";
  }>;
}>;

export const FN_SELECTOR = "0x1c10893f" as const;
const FN_INPUTS = [
  {
    name: "user",
    type: "address",
    internalType: "address",
  },
  {
    name: "roles",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `grantRoles` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `grantRoles` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGrantRolesSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGrantRolesSupported(contract);
 * ```
 */
export async function isGrantRolesSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "grantRoles" function.
 * @param options - The options for the grantRoles function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeGrantRolesParams } "thirdweb/extensions/modular";
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeGrantRoles } "thirdweb/extensions/modular";
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { grantRoles } from "thirdweb/extensions/modular";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.user, resolvedOptions.roles] as const;
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
