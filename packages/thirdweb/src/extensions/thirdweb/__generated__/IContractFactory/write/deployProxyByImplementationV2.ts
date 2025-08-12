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
 * Represents the parameters for the "deployProxyByImplementationV2" function.
 */
export type DeployProxyByImplementationV2Params = WithOverrides<{
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
  extraData: AbiParameterToPrimitiveType<{ type: "bytes"; name: "extraData" }>;
}>;

export const FN_SELECTOR = "0xd057c8b1" as const;
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
  {
    name: "extraData",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `deployProxyByImplementationV2` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `deployProxyByImplementationV2` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isDeployProxyByImplementationV2Supported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isDeployProxyByImplementationV2Supported(["0x..."]);
 * ```
 */
export function isDeployProxyByImplementationV2Supported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deployProxyByImplementationV2" function.
 * @param options - The options for the deployProxyByImplementationV2 function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeDeployProxyByImplementationV2Params } from "thirdweb/extensions/thirdweb";
 * const result = encodeDeployProxyByImplementationV2Params({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  extraData: ...,
 * });
 * ```
 */
export function encodeDeployProxyByImplementationV2Params(
  options: DeployProxyByImplementationV2Params,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.implementation,
    options.data,
    options.salt,
    options.extraData,
  ]);
}

/**
 * Encodes the "deployProxyByImplementationV2" function into a Hex string with its parameters.
 * @param options - The options for the deployProxyByImplementationV2 function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeDeployProxyByImplementationV2 } from "thirdweb/extensions/thirdweb";
 * const result = encodeDeployProxyByImplementationV2({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  extraData: ...,
 * });
 * ```
 */
export function encodeDeployProxyByImplementationV2(
  options: DeployProxyByImplementationV2Params,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDeployProxyByImplementationV2Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deployProxyByImplementationV2" function on the contract.
 * @param options - The options for the "deployProxyByImplementationV2" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { deployProxyByImplementationV2 } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deployProxyByImplementationV2({
 *  contract,
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  extraData: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function deployProxyByImplementationV2(
  options: BaseTransactionOptions<
    | DeployProxyByImplementationV2Params
    | {
        asyncParams: () => Promise<DeployProxyByImplementationV2Params>;
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
        resolvedOptions.extraData,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
