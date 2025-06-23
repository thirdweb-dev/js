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
  {
    name: "userOpHash",
    type: "bytes32",
  },
  {
    name: "missingAccountFunds",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "validationData",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `validateUserOp` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `validateUserOp` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isValidateUserOpSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isValidateUserOpSupported(["0x..."]);
 * ```
 */
export function isValidateUserOpSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "validateUserOp" function.
 * @param options - The options for the validateUserOp function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeValidateUserOpParams } from "thirdweb/extensions/erc4337";
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
 * Encodes the "validateUserOp" function into a Hex string with its parameters.
 * @param options - The options for the validateUserOp function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeValidateUserOp } from "thirdweb/extensions/erc4337";
 * const result = encodeValidateUserOp({
 *  userOp: ...,
 *  userOpHash: ...,
 *  missingAccountFunds: ...,
 * });
 * ```
 */
export function encodeValidateUserOp(options: ValidateUserOpParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeValidateUserOpParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "validateUserOp" function on the contract.
 * @param options - The options for the "validateUserOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { validateUserOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = validateUserOp({
 *  contract,
 *  userOp: ...,
 *  userOpHash: ...,
 *  missingAccountFunds: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
        resolvedOptions.userOp,
        resolvedOptions.userOpHash,
        resolvedOptions.missingAccountFunds,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
