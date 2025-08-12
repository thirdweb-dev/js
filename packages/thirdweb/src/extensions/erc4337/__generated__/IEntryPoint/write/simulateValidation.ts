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
    components: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "nonce",
        type: "uint256",
      },
      {
        name: "initCode",
        type: "bytes",
      },
      {
        name: "callData",
        type: "bytes",
      },
      {
        name: "callGasLimit",
        type: "uint256",
      },
      {
        name: "verificationGasLimit",
        type: "uint256",
      },
      {
        name: "preVerificationGas",
        type: "uint256",
      },
      {
        name: "maxFeePerGas",
        type: "uint256",
      },
      {
        name: "maxPriorityFeePerGas",
        type: "uint256",
      },
      {
        name: "paymasterAndData",
        type: "bytes",
      },
      {
        name: "signature",
        type: "bytes",
      },
    ],
    name: "userOp",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `simulateValidation` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `simulateValidation` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isSimulateValidationSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isSimulateValidationSupported(["0x..."]);
 * ```
 */
export function isSimulateValidationSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
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
 * import { encodeSimulateValidationParams } from "thirdweb/extensions/erc4337";
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
 * import { encodeSimulateValidation } from "thirdweb/extensions/erc4337";
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
 * import { sendTransaction } from "thirdweb";
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
 * await sendTransaction({ transaction, account });
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
      return [resolvedOptions.userOp] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
