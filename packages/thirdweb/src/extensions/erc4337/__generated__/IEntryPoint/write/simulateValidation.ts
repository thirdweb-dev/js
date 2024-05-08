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
 * Represents the parameters for the "simulateValidation" function.
 */
export type SimulateValidationParams = WithOverrides<{
  userOp: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "userOp";
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
}>;

export const FN_SELECTOR = "0xee219423" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "userOp",
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `simulateValidation` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `simulateValidation` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isSimulateValidationSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isSimulateValidationSupported(contract);
 * ```
 */
export async function isSimulateValidationSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "simulateValidation" function.
 * @param options - The options for the simulateValidation function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeSimulateValidationParams } "thirdweb/extensions/erc4337";
 * const result = encodeSimulateValidationParams({
 *  userOp: ...,
 * });
 * ```
 */
export function encodeSimulateValidationParams(
  options: SimulateValidationParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.userOp]);
}

/**
 * Encodes the "simulateValidation" function into a Hex string with its parameters.
 * @param options - The options for the simulateValidation function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeSimulateValidation } "thirdweb/extensions/erc4337";
 * const result = encodeSimulateValidation({
 *  userOp: ...,
 * });
 * ```
 */
export function encodeSimulateValidation(options: SimulateValidationParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSimulateValidationParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "simulateValidation" function on the contract.
 * @param options - The options for the "simulateValidation" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { simulateValidation } from "thirdweb/extensions/erc4337";
 *
 * const transaction = simulateValidation({
 *  contract,
 *  userOp: ...,
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
export function simulateValidation(
  options: BaseTransactionOptions<
    | SimulateValidationParams
    | {
        asyncParams: () => Promise<SimulateValidationParams>;
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
      return [resolvedOptions.userOp] as const;
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
