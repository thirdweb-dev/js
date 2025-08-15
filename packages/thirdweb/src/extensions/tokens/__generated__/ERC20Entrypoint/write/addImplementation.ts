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
 * Represents the parameters for the "addImplementation" function.
 */
export type AddImplementationParams = WithOverrides<{
  config: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "config";
    components: [
      { type: "bytes32"; name: "contractId" },
      { type: "address"; name: "implementation" },
      { type: "uint8"; name: "implementationType" },
      { type: "uint8"; name: "createHook" },
      { type: "bytes"; name: "createHookData" },
    ];
  }>;
  isDefault: AbiParameterToPrimitiveType<{ type: "bool"; name: "isDefault" }>;
}>;

export const FN_SELECTOR = "0x4bf8055d" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "config",
    components: [
      {
        type: "bytes32",
        name: "contractId",
      },
      {
        type: "address",
        name: "implementation",
      },
      {
        type: "uint8",
        name: "implementationType",
      },
      {
        type: "uint8",
        name: "createHook",
      },
      {
        type: "bytes",
        name: "createHookData",
      },
    ],
  },
  {
    type: "bool",
    name: "isDefault",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `addImplementation` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `addImplementation` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isAddImplementationSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isAddImplementationSupported(["0x..."]);
 * ```
 */
export function isAddImplementationSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "addImplementation" function.
 * @param options - The options for the addImplementation function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeAddImplementationParams } from "thirdweb/extensions/tokens";
 * const result = encodeAddImplementationParams({
 *  config: ...,
 *  isDefault: ...,
 * });
 * ```
 */
export function encodeAddImplementationParams(
  options: AddImplementationParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.config, options.isDefault]);
}

/**
 * Encodes the "addImplementation" function into a Hex string with its parameters.
 * @param options - The options for the addImplementation function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeAddImplementation } from "thirdweb/extensions/tokens";
 * const result = encodeAddImplementation({
 *  config: ...,
 *  isDefault: ...,
 * });
 * ```
 */
export function encodeAddImplementation(options: AddImplementationParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAddImplementationParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "addImplementation" function on the contract.
 * @param options - The options for the "addImplementation" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { addImplementation } from "thirdweb/extensions/tokens";
 *
 * const transaction = addImplementation({
 *  contract,
 *  config: ...,
 *  isDefault: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function addImplementation(
  options: BaseTransactionOptions<
    | AddImplementationParams
    | {
        asyncParams: () => Promise<AddImplementationParams>;
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
      return [resolvedOptions.config, resolvedOptions.isDefault] as const;
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
