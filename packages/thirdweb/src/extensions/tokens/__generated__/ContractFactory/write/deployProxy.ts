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
 * Represents the parameters for the "deployProxy" function.
 */
export type DeployProxyParams = WithOverrides<{
  id: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "id" }>;
  deployType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "deployType";
  }>;
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
  postDeployCalls: AbiParameterToPrimitiveType<{
    type: "bytes[]";
    name: "postDeployCalls";
  }>;
}>;

export const FN_SELECTOR = "0xfe513ef9" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "id",
  },
  {
    type: "uint8",
    name: "deployType",
  },
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
    type: "bytes[]",
    name: "postDeployCalls",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "deployed",
  },
] as const;

/**
 * Checks if the `deployProxy` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `deployProxy` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isDeployProxySupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isDeployProxySupported(["0x..."]);
 * ```
 */
export function isDeployProxySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deployProxy" function.
 * @param options - The options for the deployProxy function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeDeployProxyParams } from "thirdweb/extensions/tokens";
 * const result = encodeDeployProxyParams({
 *  id: ...,
 *  deployType: ...,
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  postDeployCalls: ...,
 * });
 * ```
 */
export function encodeDeployProxyParams(options: DeployProxyParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.id,
    options.deployType,
    options.implementation,
    options.data,
    options.salt,
    options.postDeployCalls,
  ]);
}

/**
 * Encodes the "deployProxy" function into a Hex string with its parameters.
 * @param options - The options for the deployProxy function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeDeployProxy } from "thirdweb/extensions/tokens";
 * const result = encodeDeployProxy({
 *  id: ...,
 *  deployType: ...,
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  postDeployCalls: ...,
 * });
 * ```
 */
export function encodeDeployProxy(options: DeployProxyParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDeployProxyParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deployProxy" function on the contract.
 * @param options - The options for the "deployProxy" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { deployProxy } from "thirdweb/extensions/tokens";
 *
 * const transaction = deployProxy({
 *  contract,
 *  id: ...,
 *  deployType: ...,
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 *  postDeployCalls: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function deployProxy(
  options: BaseTransactionOptions<
    | DeployProxyParams
    | {
        asyncParams: () => Promise<DeployProxyParams>;
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
        resolvedOptions.id,
        resolvedOptions.deployType,
        resolvedOptions.implementation,
        resolvedOptions.data,
        resolvedOptions.salt,
        resolvedOptions.postDeployCalls,
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
