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
 * Represents the parameters for the "simulateHandleOp" function.
 */
export type SimulateHandleOpParams = WithOverrides<{
  op: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "op";
    components: [
      { type: "address"; name: "sender" },
      { type: "uint256"; name: "nonce" },
      { type: "bytes"; name: "initCode" },
      { type: "bytes"; name: "callData" },
      { type: "uint256"; name: "callGasLimit" },
      { type: "uint256"; name: "verificationGasLimit" },
      { type: "uint256"; name: "preVerificationGas" },
      { type: "uint256"; name: "maxFeePerGas" },
      { type: "uint256"; name: "maxPriorityFeePerGas" },
      { type: "bytes"; name: "paymasterAndData" },
      { type: "bytes"; name: "signature" },
    ];
  }>;
  target: AbiParameterToPrimitiveType<{ type: "address"; name: "target" }>;
  targetCallData: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "targetCallData";
  }>;
}>;

export const FN_SELECTOR = "0xd6383f94" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "op",
    components: [
      {
        type: "address",
        name: "sender",
      },
      {
        type: "uint256",
        name: "nonce",
      },
      {
        type: "bytes",
        name: "initCode",
      },
      {
        type: "bytes",
        name: "callData",
      },
      {
        type: "uint256",
        name: "callGasLimit",
      },
      {
        type: "uint256",
        name: "verificationGasLimit",
      },
      {
        type: "uint256",
        name: "preVerificationGas",
      },
      {
        type: "uint256",
        name: "maxFeePerGas",
      },
      {
        type: "uint256",
        name: "maxPriorityFeePerGas",
      },
      {
        type: "bytes",
        name: "paymasterAndData",
      },
      {
        type: "bytes",
        name: "signature",
      },
    ],
  },
  {
    type: "address",
    name: "target",
  },
  {
    type: "bytes",
    name: "targetCallData",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `simulateHandleOp` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `simulateHandleOp` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isSimulateHandleOpSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isSimulateHandleOpSupported(contract);
 * ```
 */
export async function isSimulateHandleOpSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "simulateHandleOp" function.
 * @param options - The options for the simulateHandleOp function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeSimulateHandleOpParams } "thirdweb/extensions/erc4337";
 * const result = encodeSimulateHandleOpParams({
 *  op: ...,
 *  target: ...,
 *  targetCallData: ...,
 * });
 * ```
 */
export function encodeSimulateHandleOpParams(options: SimulateHandleOpParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.op,
    options.target,
    options.targetCallData,
  ]);
}

/**
 * Encodes the "simulateHandleOp" function into a Hex string with its parameters.
 * @param options - The options for the simulateHandleOp function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeSimulateHandleOp } "thirdweb/extensions/erc4337";
 * const result = encodeSimulateHandleOp({
 *  op: ...,
 *  target: ...,
 *  targetCallData: ...,
 * });
 * ```
 */
export function encodeSimulateHandleOp(options: SimulateHandleOpParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSimulateHandleOpParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "simulateHandleOp" function on the contract.
 * @param options - The options for the "simulateHandleOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { simulateHandleOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = simulateHandleOp({
 *  contract,
 *  op: ...,
 *  target: ...,
 *  targetCallData: ...,
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
export function simulateHandleOp(
  options: BaseTransactionOptions<
    | SimulateHandleOpParams
    | {
        asyncParams: () => Promise<SimulateHandleOpParams>;
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
        resolvedOptions.op,
        resolvedOptions.target,
        resolvedOptions.targetCallData,
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
  });
}
