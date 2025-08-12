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
 * Represents the parameters for the "deployProxyByImplementation" function.
 */
export type DeployProxyByImplementationParams = WithOverrides<{
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
}>;

export const FN_SELECTOR = "0x11b804ab" as const;
const FN_INPUTS = [
  {
    name: "implementation",
    type: "address",
  },
  {
    name: "data",
    type: "bytes",
  },
  {
    name: "salt",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `deployProxyByImplementation` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `deployProxyByImplementation` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isDeployProxyByImplementationSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isDeployProxyByImplementationSupported(["0x..."]);
 * ```
 */
export function isDeployProxyByImplementationSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deployProxyByImplementation" function.
 * @param options - The options for the deployProxyByImplementation function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeDeployProxyByImplementationParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeDeployProxyByImplementationParams({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeDeployProxyByImplementationParams(
  options: DeployProxyByImplementationParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.implementation,
    options.data,
    options.salt,
  ]);
}

/**
 * Encodes the "deployProxyByImplementation" function into a Hex string with its parameters.
 * @param options - The options for the deployProxyByImplementation function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeDeployProxyByImplementation } from "thirdweb/extensions/thirdweb";
 * const result = encodeDeployProxyByImplementation({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeDeployProxyByImplementation(
  options: DeployProxyByImplementationParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDeployProxyByImplementationParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deployProxyByImplementation" function on the contract.
 * @param options - The options for the "deployProxyByImplementation" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { deployProxyByImplementation } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deployProxyByImplementation({
 *  contract,
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function deployProxyByImplementation(
  options: BaseTransactionOptions<
    | DeployProxyByImplementationParams
    | {
        asyncParams: () => Promise<DeployProxyByImplementationParams>;
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
        resolvedOptions.implementation,
        resolvedOptions.data,
        resolvedOptions.salt,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
