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
 * Represents the parameters for the "grantRole" function.
 */
export type GrantRoleParams = WithOverrides<{
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
}>;

export const FN_SELECTOR = "0x2f2ff15d" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "role",
  },
  {
    type: "address",
    name: "account",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `grantRole` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `grantRole` method is supported.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { isGrantRoleSupported } from "thirdweb/extensions/permissions";
 *
 * const supported = await isGrantRoleSupported(contract);
 * ```
 */
export async function isGrantRoleSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "grantRole" function.
 * @param options - The options for the grantRole function.
 * @returns The encoded ABI parameters.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { encodeGrantRoleParams } "thirdweb/extensions/permissions";
 * const result = encodeGrantRoleParams({
 *  role: ...,
 *  account: ...,
 * });
 * ```
 */
export function encodeGrantRoleParams(options: GrantRoleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.role, options.account]);
}

/**
 * Encodes the "grantRole" function into a Hex string with its parameters.
 * @param options - The options for the grantRole function.
 * @returns The encoded hexadecimal string.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { encodeGrantRole } "thirdweb/extensions/permissions";
 * const result = encodeGrantRole({
 *  role: ...,
 *  account: ...,
 * });
 * ```
 */
export function encodeGrantRole(options: GrantRoleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGrantRoleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "grantRole" function on the contract.
 * @param options - The options for the "grantRole" function.
 * @returns A prepared transaction object.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { grantRole } from "thirdweb/extensions/permissions";
 *
 * const transaction = grantRole({
 *  contract,
 *  role: ...,
 *  account: ...,
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
export function grantRole(
  options: BaseTransactionOptions<
    | GrantRoleParams
    | {
        asyncParams: () => Promise<GrantRoleParams>;
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
      return [resolvedOptions.role, resolvedOptions.account] as const;
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
