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
 * Represents the parameters for the "renounceRoles" function.
 */
export type RenounceRolesParams = WithOverrides<{
  roles: AbiParameterToPrimitiveType<{
    name: "roles";
    type: "uint256";
    internalType: "uint256";
  }>;
}>;

export const FN_SELECTOR = "0x183a4f6e" as const;
const FN_INPUTS = [
  {
    name: "roles",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `renounceRoles` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `renounceRoles` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isRenounceRolesSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isRenounceRolesSupported(contract);
 * ```
 */
export async function isRenounceRolesSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "renounceRoles" function.
 * @param options - The options for the renounceRoles function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeRenounceRolesParams } "thirdweb/extensions/modular";
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeRenounceRoles } "thirdweb/extensions/modular";
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { renounceRoles } from "thirdweb/extensions/modular";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.roles] as const;
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
