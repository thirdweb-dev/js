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
 * Represents the parameters for the "execute" function.
 */
export type ExecuteParams = WithOverrides<{
  targets: AbiParameterToPrimitiveType<{ type: "address[]"; name: "targets" }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "values" }>;
  calldatas: AbiParameterToPrimitiveType<{
    type: "bytes[]";
    name: "calldatas";
  }>;
  descriptionHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "descriptionHash";
  }>;
}>;

export const FN_SELECTOR = "0x2656227d" as const;
const FN_INPUTS = [
  {
    name: "targets",
    type: "address[]",
  },
  {
    name: "values",
    type: "uint256[]",
  },
  {
    name: "calldatas",
    type: "bytes[]",
  },
  {
    name: "descriptionHash",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `execute` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `execute` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isExecuteSupported } from "thirdweb/extensions/vote";
 *
 * const supported = isExecuteSupported(["0x..."]);
 * ```
 */
export function isExecuteSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "execute" function.
 * @param options - The options for the execute function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeExecuteParams } from "thirdweb/extensions/vote";
 * const result = encodeExecuteParams({
 *  targets: ...,
 *  values: ...,
 *  calldatas: ...,
 *  descriptionHash: ...,
 * });
 * ```
 */
export function encodeExecuteParams(options: ExecuteParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.targets,
    options.values,
    options.calldatas,
    options.descriptionHash,
  ]);
}

/**
 * Encodes the "execute" function into a Hex string with its parameters.
 * @param options - The options for the execute function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeExecute } from "thirdweb/extensions/vote";
 * const result = encodeExecute({
 *  targets: ...,
 *  values: ...,
 *  calldatas: ...,
 *  descriptionHash: ...,
 * });
 * ```
 */
export function encodeExecute(options: ExecuteParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeExecuteParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "execute" function on the contract.
 * @param options - The options for the "execute" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { execute } from "thirdweb/extensions/vote";
 *
 * const transaction = execute({
 *  contract,
 *  targets: ...,
 *  values: ...,
 *  calldatas: ...,
 *  descriptionHash: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function execute(
  options: BaseTransactionOptions<
    | ExecuteParams
    | {
        asyncParams: () => Promise<ExecuteParams>;
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
        resolvedOptions.targets,
        resolvedOptions.values,
        resolvedOptions.calldatas,
        resolvedOptions.descriptionHash,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
