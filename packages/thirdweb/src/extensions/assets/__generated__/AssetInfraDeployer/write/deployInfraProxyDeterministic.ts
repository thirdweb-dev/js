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
 * Represents the parameters for the "deployInfraProxyDeterministic" function.
 */
export type DeployInfraProxyDeterministicParams = WithOverrides<{
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
  extraData: AbiParameterToPrimitiveType<{ type: "bytes"; name: "extraData" }>;
}>;

export const FN_SELECTOR = "0xb43c830c" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "implementation",
  },
  {
    type: "bytes",
    name: "data",
  },
  {
    type: "bytes32",
    name: "salt",
  },
  {
    type: "bytes",
    name: "extraData",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "deployedProxy",
  },
] as const;

/**
 * Checks if the `deployInfraProxyDeterministic` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `deployInfraProxyDeterministic` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isDeployInfraProxyDeterministicSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isDeployInfraProxyDeterministicSupported(["0x..."]);
 * ```
 */
export function isDeployInfraProxyDeterministicSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deployInfraProxyDeterministic" function.
 * @param options - The options for the deployInfraProxyDeterministic function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeDeployInfraProxyDeterministicParams } from "thirdweb/extensions/assets";
 * const result = encodeDeployInfraProxyDeterministicParams({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  extraData: ...,
 * });
 * ```
 */
export function encodeDeployInfraProxyDeterministicParams(
  options: DeployInfraProxyDeterministicParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.implementation,
    options.data,
    options.salt,
    options.extraData,
  ]);
}

/**
 * Encodes the "deployInfraProxyDeterministic" function into a Hex string with its parameters.
 * @param options - The options for the deployInfraProxyDeterministic function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeDeployInfraProxyDeterministic } from "thirdweb/extensions/assets";
 * const result = encodeDeployInfraProxyDeterministic({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  extraData: ...,
 * });
 * ```
 */
export function encodeDeployInfraProxyDeterministic(
  options: DeployInfraProxyDeterministicParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDeployInfraProxyDeterministicParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deployInfraProxyDeterministic" function on the contract.
 * @param options - The options for the "deployInfraProxyDeterministic" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { deployInfraProxyDeterministic } from "thirdweb/extensions/assets";
 *
 * const transaction = deployInfraProxyDeterministic({
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
export function deployInfraProxyDeterministic(
  options: BaseTransactionOptions<
    | DeployInfraProxyDeterministicParams
    | {
        asyncParams: () => Promise<DeployInfraProxyDeterministicParams>;
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
        resolvedOptions.implementation,
        resolvedOptions.data,
        resolvedOptions.salt,
        resolvedOptions.extraData,
      ] as const;
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}
