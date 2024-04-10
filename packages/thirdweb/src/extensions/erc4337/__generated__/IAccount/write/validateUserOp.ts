import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "validateUserOp" function.
 */
export type ValidateUserOpParams = WithOverrides<{
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
  missingAccountFunds: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "missingAccountFunds";
  }>;
}>;

export const FN_SELECTOR = "0x3a871cdd" as const;
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
    name: "missingAccountFunds",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "validationData",
  },
] as const;

/**
 * Encodes the parameters for the "validateUserOp" function.
 * @param options - The options for the validateUserOp function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeValidateUserOpParams } "thirdweb/extensions/erc4337";
 * const result = encodeValidateUserOpParams({
 *  userOp: ...,
 *  userOpHash: ...,
 *  missingAccountFunds: ...,
 * });
 * ```
 */
export function encodeValidateUserOpParams(options: ValidateUserOpParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.userOp,
    options.userOpHash,
    options.missingAccountFunds,
  ]);
}

/**
 * Calls the "validateUserOp" function on the contract.
 * @param options - The options for the "validateUserOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { validateUserOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = validateUserOp({
 *  contract,
 *  userOp: ...,
 *  userOpHash: ...,
 *  missingAccountFunds: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function validateUserOp(
  options: BaseTransactionOptions<
    | ValidateUserOpParams
    | {
        asyncParams: () => Promise<ValidateUserOpParams>;
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
        resolvedOptions.missingAccountFunds,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
