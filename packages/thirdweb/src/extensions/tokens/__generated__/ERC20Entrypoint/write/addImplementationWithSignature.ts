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
 * Represents the parameters for the "addImplementationWithSignature" function.
 */
export type AddImplementationWithSignatureParams = WithOverrides<{
  request: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "request";
    components: [
      {
        type: "tuple";
        name: "config";
        components: [
          { type: "bytes32"; name: "contractId" },
          { type: "address"; name: "implementation" },
          { type: "uint8"; name: "implementationType" },
          { type: "uint8"; name: "createHook" },
          { type: "bytes"; name: "createHookData" },
        ];
      },
      { type: "bool"; name: "isDefault" },
      { type: "uint256"; name: "nonce" },
      { type: "uint256"; name: "deadline" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
}>;

export const FN_SELECTOR = "0x63742df3" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "request",
    components: [
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
      {
        type: "uint256",
        name: "nonce",
      },
      {
        type: "uint256",
        name: "deadline",
      },
    ],
  },
  {
    type: "bytes",
    name: "signature",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `addImplementationWithSignature` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `addImplementationWithSignature` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isAddImplementationWithSignatureSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isAddImplementationWithSignatureSupported(["0x..."]);
 * ```
 */
export function isAddImplementationWithSignatureSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "addImplementationWithSignature" function.
 * @param options - The options for the addImplementationWithSignature function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeAddImplementationWithSignatureParams } from "thirdweb/extensions/tokens";
 * const result = encodeAddImplementationWithSignatureParams({
 *  request: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeAddImplementationWithSignatureParams(
  options: AddImplementationWithSignatureParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.request, options.signature]);
}

/**
 * Encodes the "addImplementationWithSignature" function into a Hex string with its parameters.
 * @param options - The options for the addImplementationWithSignature function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeAddImplementationWithSignature } from "thirdweb/extensions/tokens";
 * const result = encodeAddImplementationWithSignature({
 *  request: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeAddImplementationWithSignature(
  options: AddImplementationWithSignatureParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAddImplementationWithSignatureParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "addImplementationWithSignature" function on the contract.
 * @param options - The options for the "addImplementationWithSignature" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { addImplementationWithSignature } from "thirdweb/extensions/tokens";
 *
 * const transaction = addImplementationWithSignature({
 *  contract,
 *  request: ...,
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
export function addImplementationWithSignature(
  options: BaseTransactionOptions<
    | AddImplementationWithSignatureParams
    | {
        asyncParams: () => Promise<AddImplementationWithSignatureParams>;
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
      return [resolvedOptions.request, resolvedOptions.signature] as const;
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
