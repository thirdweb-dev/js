import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "createPool" function.
 */
export type CreatePoolParams = WithOverrides<{
  createPoolConfig: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "createPoolConfig";
    components: [
      { type: "address"; name: "recipient" },
      { type: "address"; name: "referrer" },
      { type: "address"; name: "tokenA" },
      { type: "address"; name: "tokenB" },
      { type: "uint256"; name: "amountA" },
      { type: "uint256"; name: "amountB" },
      { type: "bytes"; name: "data" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0xa1970c55" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "createPoolConfig",
    components: [
      {
        type: "address",
        name: "recipient",
      },
      {
        type: "address",
        name: "referrer",
      },
      {
        type: "address",
        name: "tokenA",
      },
      {
        type: "address",
        name: "tokenB",
      },
      {
        type: "uint256",
        name: "amountA",
      },
      {
        type: "uint256",
        name: "amountB",
      },
      {
        type: "bytes",
        name: "data",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "pool",
  },
  {
    type: "address",
    name: "position",
  },
  {
    type: "uint256",
    name: "positionId",
  },
  {
    type: "uint256",
    name: "refundAmount0",
  },
  {
    type: "uint256",
    name: "refundAmount1",
  },
] as const;

/**
 * Checks if the `createPool` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createPool` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isCreatePoolSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isCreatePoolSupported(["0x..."]);
 * ```
 */
export function isCreatePoolSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createPool" function.
 * @param options - The options for the createPool function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreatePoolParams } from "thirdweb/extensions/assets";
 * const result = encodeCreatePoolParams({
 *  createPoolConfig: ...,
 * });
 * ```
 */
export function encodeCreatePoolParams(options: CreatePoolParams) {
  return encodeAbiParameters(FN_INPUTS, [options.createPoolConfig]);
}

/**
 * Encodes the "createPool" function into a Hex string with its parameters.
 * @param options - The options for the createPool function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreatePool } from "thirdweb/extensions/assets";
 * const result = encodeCreatePool({
 *  createPoolConfig: ...,
 * });
 * ```
 */
export function encodeCreatePool(options: CreatePoolParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreatePoolParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createPool" function on the contract.
 * @param options - The options for the "createPool" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createPool } from "thirdweb/extensions/assets";
 *
 * const transaction = createPool({
 *  contract,
 *  createPoolConfig: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function createPool(
  options: BaseTransactionOptions<
    | CreatePoolParams
    | {
        asyncParams: () => Promise<CreatePoolParams>;
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
      return [resolvedOptions.createPoolConfig] as const;
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
