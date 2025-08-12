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
 * Represents the parameters for the "deploy" function.
 */
export type DeployParams = WithOverrides<{
  bytecode: AbiParameterToPrimitiveType<{ type: "bytes"; name: "bytecode" }>;
  initData: AbiParameterToPrimitiveType<{ type: "bytes"; name: "initData" }>;
  initValue: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "initValue";
  }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
}>;

export const FN_SELECTOR = "0xa9a8e4e9" as const;
const FN_INPUTS = [
  {
    name: "bytecode",
    type: "bytes",
  },
  {
    name: "initData",
    type: "bytes",
  },
  {
    name: "initValue",
    type: "uint256",
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
 * Checks if the `deploy` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `deploy` method is supported.
 * @extension STYLUS
 * @example
 * ```ts
 * import { isDeploySupported } from "thirdweb/extensions/stylus";
 *
 * const supported = isDeploySupported(["0x..."]);
 * ```
 */
export function isDeploySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deploy" function.
 * @param options - The options for the deploy function.
 * @returns The encoded ABI parameters.
 * @extension STYLUS
 * @example
 * ```ts
 * import { encodeDeployParams } from "thirdweb/extensions/stylus";
 * const result = encodeDeployParams({
 *  bytecode: ...,
 *  initData: ...,
 *  initValue: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeDeployParams(options: DeployParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.bytecode,
    options.initData,
    options.initValue,
    options.salt,
  ]);
}

/**
 * Encodes the "deploy" function into a Hex string with its parameters.
 * @param options - The options for the deploy function.
 * @returns The encoded hexadecimal string.
 * @extension STYLUS
 * @example
 * ```ts
 * import { encodeDeploy } from "thirdweb/extensions/stylus";
 * const result = encodeDeploy({
 *  bytecode: ...,
 *  initData: ...,
 *  initValue: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeDeploy(options: DeployParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDeployParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deploy" function on the contract.
 * @param options - The options for the "deploy" function.
 * @returns A prepared transaction object.
 * @extension STYLUS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { deploy } from "thirdweb/extensions/stylus";
 *
 * const transaction = deploy({
 *  contract,
 *  bytecode: ...,
 *  initData: ...,
 *  initValue: ...,
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
export function deploy(
  options: BaseTransactionOptions<
    | DeployParams
    | {
        asyncParams: () => Promise<DeployParams>;
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
        resolvedOptions.bytecode,
        resolvedOptions.initData,
        resolvedOptions.initValue,
        resolvedOptions.salt,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
