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
 * Represents the parameters for the "deployContract" function.
 */
export type DeployContractParams = WithOverrides<{
  id: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "id" }>;
  deployType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "deployType";
  }>;
  bytecode: AbiParameterToPrimitiveType<{ type: "bytes"; name: "bytecode" }>;
  constructorArgs: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "constructorArgs";
  }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
  postDeployCalls: AbiParameterToPrimitiveType<{
    type: "bytes[]";
    name: "postDeployCalls";
  }>;
}>;

export const FN_SELECTOR = "0x8bc106dd" as const;
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
    type: "bytes",
    name: "bytecode",
  },
  {
    type: "bytes",
    name: "constructorArgs",
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
 * Checks if the `deployContract` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `deployContract` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isDeployContractSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isDeployContractSupported(["0x..."]);
 * ```
 */
export function isDeployContractSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deployContract" function.
 * @param options - The options for the deployContract function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeDeployContractParams } from "thirdweb/extensions/tokens";
 * const result = encodeDeployContractParams({
 *  id: ...,
 *  deployType: ...,
 *  bytecode: ...,
 *  constructorArgs: ...,
 *  salt: ...,
 *  postDeployCalls: ...,
 * });
 * ```
 */
export function encodeDeployContractParams(options: DeployContractParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.id,
    options.deployType,
    options.bytecode,
    options.constructorArgs,
    options.salt,
    options.postDeployCalls,
  ]);
}

/**
 * Encodes the "deployContract" function into a Hex string with its parameters.
 * @param options - The options for the deployContract function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeDeployContract } from "thirdweb/extensions/tokens";
 * const result = encodeDeployContract({
 *  id: ...,
 *  deployType: ...,
 *  bytecode: ...,
 *  constructorArgs: ...,
 *  salt: ...,
 *  postDeployCalls: ...,
 * });
 * ```
 */
export function encodeDeployContract(options: DeployContractParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDeployContractParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deployContract" function on the contract.
 * @param options - The options for the "deployContract" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { deployContract } from "thirdweb/extensions/tokens";
 *
 * const transaction = deployContract({
 *  contract,
 *  id: ...,
 *  deployType: ...,
 *  bytecode: ...,
 *  constructorArgs: ...,
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
export function deployContract(
  options: BaseTransactionOptions<
    | DeployContractParams
    | {
        asyncParams: () => Promise<DeployContractParams>;
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
        resolvedOptions.bytecode,
        resolvedOptions.constructorArgs,
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
