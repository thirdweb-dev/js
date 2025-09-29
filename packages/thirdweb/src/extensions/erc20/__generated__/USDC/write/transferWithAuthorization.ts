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
 * Represents the parameters for the "transferWithAuthorization" function.
 */
export type TransferWithAuthorizationParams = WithOverrides<{
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  validAfter: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "validAfter";
  }>;
  validBefore: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "validBefore";
  }>;
  nonce: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "nonce" }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
}>;

export const FN_SELECTOR = "0xcf092995" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "from",
  },
  {
    type: "address",
    name: "to",
  },
  {
    type: "uint256",
    name: "value",
  },
  {
    type: "uint256",
    name: "validAfter",
  },
  {
    type: "uint256",
    name: "validBefore",
  },
  {
    type: "bytes32",
    name: "nonce",
  },
  {
    type: "bytes",
    name: "signature",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `transferWithAuthorization` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `transferWithAuthorization` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isTransferWithAuthorizationSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = isTransferWithAuthorizationSupported(["0x..."]);
 * ```
 */
export function isTransferWithAuthorizationSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "transferWithAuthorization" function.
 * @param options - The options for the transferWithAuthorization function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeTransferWithAuthorizationParams } from "thirdweb/extensions/erc20";
 * const result = encodeTransferWithAuthorizationParams({
 *  from: ...,
 *  to: ...,
 *  value: ...,
 *  validAfter: ...,
 *  validBefore: ...,
 *  nonce: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeTransferWithAuthorizationParams(
  options: TransferWithAuthorizationParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.value,
    options.validAfter,
    options.validBefore,
    options.nonce,
    options.signature,
  ]);
}

/**
 * Encodes the "transferWithAuthorization" function into a Hex string with its parameters.
 * @param options - The options for the transferWithAuthorization function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeTransferWithAuthorization } from "thirdweb/extensions/erc20";
 * const result = encodeTransferWithAuthorization({
 *  from: ...,
 *  to: ...,
 *  value: ...,
 *  validAfter: ...,
 *  validBefore: ...,
 *  nonce: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeTransferWithAuthorization(
  options: TransferWithAuthorizationParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTransferWithAuthorizationParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "transferWithAuthorization" function on the contract.
 * @param options - The options for the "transferWithAuthorization" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { transferWithAuthorization } from "thirdweb/extensions/erc20";
 *
 * const transaction = transferWithAuthorization({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  value: ...,
 *  validAfter: ...,
 *  validBefore: ...,
 *  nonce: ...,
 *  signature: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function transferWithAuthorization(
  options: BaseTransactionOptions<
    | TransferWithAuthorizationParams
    | {
        asyncParams: () => Promise<TransferWithAuthorizationParams>;
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
        resolvedOptions.from,
        resolvedOptions.to,
        resolvedOptions.value,
        resolvedOptions.validAfter,
        resolvedOptions.validBefore,
        resolvedOptions.nonce,
        resolvedOptions.signature,
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
