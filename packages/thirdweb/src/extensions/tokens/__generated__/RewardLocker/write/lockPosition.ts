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
 * Represents the parameters for the "lockPosition" function.
 */
export type LockPositionParams = WithOverrides<{
  asset: AbiParameterToPrimitiveType<{ type: "address"; name: "asset" }>;
  positionManager: AbiParameterToPrimitiveType<{
    type: "address";
    name: "positionManager";
  }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipient";
  }>;
  referrer: AbiParameterToPrimitiveType<{ type: "address"; name: "referrer" }>;
  referrerBps: AbiParameterToPrimitiveType<{
    type: "uint16";
    name: "referrerBps";
  }>;
}>;

export const FN_SELECTOR = "0x2cde40c2" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "asset",
  },
  {
    type: "address",
    name: "positionManager",
  },
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "address",
    name: "recipient",
  },
  {
    type: "address",
    name: "referrer",
  },
  {
    type: "uint16",
    name: "referrerBps",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `lockPosition` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `lockPosition` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isLockPositionSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isLockPositionSupported(["0x..."]);
 * ```
 */
export function isLockPositionSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "lockPosition" function.
 * @param options - The options for the lockPosition function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeLockPositionParams } from "thirdweb/extensions/tokens";
 * const result = encodeLockPositionParams({
 *  asset: ...,
 *  positionManager: ...,
 *  tokenId: ...,
 *  recipient: ...,
 *  referrer: ...,
 *  referrerBps: ...,
 * });
 * ```
 */
export function encodeLockPositionParams(options: LockPositionParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.asset,
    options.positionManager,
    options.tokenId,
    options.recipient,
    options.referrer,
    options.referrerBps,
  ]);
}

/**
 * Encodes the "lockPosition" function into a Hex string with its parameters.
 * @param options - The options for the lockPosition function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeLockPosition } from "thirdweb/extensions/tokens";
 * const result = encodeLockPosition({
 *  asset: ...,
 *  positionManager: ...,
 *  tokenId: ...,
 *  recipient: ...,
 *  referrer: ...,
 *  referrerBps: ...,
 * });
 * ```
 */
export function encodeLockPosition(options: LockPositionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeLockPositionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "lockPosition" function on the contract.
 * @param options - The options for the "lockPosition" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { lockPosition } from "thirdweb/extensions/tokens";
 *
 * const transaction = lockPosition({
 *  contract,
 *  asset: ...,
 *  positionManager: ...,
 *  tokenId: ...,
 *  recipient: ...,
 *  referrer: ...,
 *  referrerBps: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function lockPosition(
  options: BaseTransactionOptions<
    | LockPositionParams
    | {
        asyncParams: () => Promise<LockPositionParams>;
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
        resolvedOptions.asset,
        resolvedOptions.positionManager,
        resolvedOptions.tokenId,
        resolvedOptions.recipient,
        resolvedOptions.referrer,
        resolvedOptions.referrerBps,
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
