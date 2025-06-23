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
 * Represents the parameters for the "executeFromExecutor" function.
 */
export type ExecuteFromExecutorParams = WithOverrides<{
  mode: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "mode" }>;
  executionCalldata: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "executionCalldata";
  }>;
}>;

export const FN_SELECTOR = "0xd691c964" as const;
const FN_INPUTS = [
  {
    name: "mode",
    type: "bytes32",
  },
  {
    name: "executionCalldata",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "returnData",
    type: "bytes[]",
  },
] as const;

/**
 * Checks if the `executeFromExecutor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `executeFromExecutor` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isExecuteFromExecutorSupported } from "thirdweb/extensions/erc7579";
 *
 * const supported = isExecuteFromExecutorSupported(["0x..."]);
 * ```
 */
export function isExecuteFromExecutorSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "executeFromExecutor" function.
 * @param options - The options for the executeFromExecutor function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeExecuteFromExecutorParams } from "thirdweb/extensions/erc7579";
 * const result = encodeExecuteFromExecutorParams({
 *  mode: ...,
 *  executionCalldata: ...,
 * });
 * ```
 */
export function encodeExecuteFromExecutorParams(
  options: ExecuteFromExecutorParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.mode,
    options.executionCalldata,
  ]);
}

/**
 * Encodes the "executeFromExecutor" function into a Hex string with its parameters.
 * @param options - The options for the executeFromExecutor function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeExecuteFromExecutor } from "thirdweb/extensions/erc7579";
 * const result = encodeExecuteFromExecutor({
 *  mode: ...,
 *  executionCalldata: ...,
 * });
 * ```
 */
export function encodeExecuteFromExecutor(options: ExecuteFromExecutorParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeExecuteFromExecutorParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "executeFromExecutor" function on the contract.
 * @param options - The options for the "executeFromExecutor" function.
 * @returns A prepared transaction object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { executeFromExecutor } from "thirdweb/extensions/erc7579";
 *
 * const transaction = executeFromExecutor({
 *  contract,
 *  mode: ...,
 *  executionCalldata: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function executeFromExecutor(
  options: BaseTransactionOptions<
    | ExecuteFromExecutorParams
    | {
        asyncParams: () => Promise<ExecuteFromExecutorParams>;
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
      return [resolvedOptions.mode, resolvedOptions.executionCalldata] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
