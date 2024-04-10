import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "validatePaymasterUserOp" function.
 */
export type ValidatePaymasterUserOpParams = WithOverrides<{
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
  userOpHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "userOpHash";
  }>;
  maxCost: AbiParameterToPrimitiveType<{ type: "uint256"; name: "maxCost" }>;
}>;

export const FN_SELECTOR = "0xf465c77e" as const;
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
  {
    type: "bytes32",
    name: "userOpHash",
  },
  {
    type: "uint256",
    name: "maxCost",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
    name: "context",
  },
  {
    type: "uint256",
    name: "validationData",
  },
] as const;

/**
 * Encodes the parameters for the "validatePaymasterUserOp" function.
 * @param options - The options for the validatePaymasterUserOp function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeValidatePaymasterUserOpParams } "thirdweb/extensions/erc4337";
 * const result = encodeValidatePaymasterUserOpParams({
 *  userOp: ...,
 *  userOpHash: ...,
 *  maxCost: ...,
 * });
 * ```
 */
export function encodeValidatePaymasterUserOpParams(
  options: ValidatePaymasterUserOpParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.userOp,
    options.userOpHash,
    options.maxCost,
  ]);
}

/**
 * Calls the "validatePaymasterUserOp" function on the contract.
 * @param options - The options for the "validatePaymasterUserOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { validatePaymasterUserOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = validatePaymasterUserOp({
 *  contract,
 *  userOp: ...,
 *  userOpHash: ...,
 *  maxCost: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function validatePaymasterUserOp(
  options: BaseTransactionOptions<
    | ValidatePaymasterUserOpParams
    | {
        asyncParams: () => Promise<ValidatePaymasterUserOpParams>;
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
        resolvedOptions.userOp,
        resolvedOptions.userOpHash,
        resolvedOptions.maxCost,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
