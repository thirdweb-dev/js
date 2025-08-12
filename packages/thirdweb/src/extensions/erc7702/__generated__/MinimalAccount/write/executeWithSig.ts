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
 * Represents the parameters for the "executeWithSig" function.
 */
export type ExecuteWithSigParams = WithOverrides<{
  wrappedCalls: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "wrappedCalls";
    components: [
      {
        type: "tuple[]";
        name: "calls";
        components: [
          { type: "address"; name: "target" },
          { type: "uint256"; name: "value" },
          { type: "bytes"; name: "data" },
        ];
      },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
}>;

export const FN_SELECTOR = "0xba61557d" as const;
const FN_INPUTS = [
  {
    components: [
      {
        components: [
          {
            name: "target",
            type: "address",
          },
          {
            name: "value",
            type: "uint256",
          },
          {
            name: "data",
            type: "bytes",
          },
        ],
        name: "calls",
        type: "tuple[]",
      },
      {
        name: "uid",
        type: "bytes32",
      },
    ],
    name: "wrappedCalls",
    type: "tuple",
  },
  {
    name: "signature",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `executeWithSig` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `executeWithSig` method is supported.
 * @extension ERC7702
 * @example
 * ```ts
 * import { isExecuteWithSigSupported } from "thirdweb/extensions/erc7702";
 *
 * const supported = isExecuteWithSigSupported(["0x..."]);
 * ```
 */
export function isExecuteWithSigSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "executeWithSig" function.
 * @param options - The options for the executeWithSig function.
 * @returns The encoded ABI parameters.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeExecuteWithSigParams } from "thirdweb/extensions/erc7702";
 * const result = encodeExecuteWithSigParams({
 *  wrappedCalls: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeExecuteWithSigParams(options: ExecuteWithSigParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.wrappedCalls,
    options.signature,
  ]);
}

/**
 * Encodes the "executeWithSig" function into a Hex string with its parameters.
 * @param options - The options for the executeWithSig function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeExecuteWithSig } from "thirdweb/extensions/erc7702";
 * const result = encodeExecuteWithSig({
 *  wrappedCalls: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeExecuteWithSig(options: ExecuteWithSigParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeExecuteWithSigParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "executeWithSig" function on the contract.
 * @param options - The options for the "executeWithSig" function.
 * @returns A prepared transaction object.
 * @extension ERC7702
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { executeWithSig } from "thirdweb/extensions/erc7702";
 *
 * const transaction = executeWithSig({
 *  contract,
 *  wrappedCalls: ...,
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
export function executeWithSig(
  options: BaseTransactionOptions<
    | ExecuteWithSigParams
    | {
        asyncParams: () => Promise<ExecuteWithSigParams>;
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
      return [resolvedOptions.wrappedCalls, resolvedOptions.signature] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
