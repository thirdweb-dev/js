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
 * Represents the parameters for the "mintWithSignature" function.
 */
export type MintWithSignatureParams = WithOverrides<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
  baseURI: AbiParameterToPrimitiveType<{ type: "string"; name: "baseURI" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
}>;

export const FN_SELECTOR = "0xe6bd6ada" as const;
const FN_INPUTS = [
  {
    name: "to",
    type: "address",
  },
  {
    name: "tokenId",
    type: "uint256",
  },
  {
    name: "amount",
    type: "uint256",
  },
  {
    name: "baseURI",
    type: "string",
  },
  {
    name: "data",
    type: "bytes",
  },
  {
    name: "signature",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `mintWithSignature` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `mintWithSignature` method is supported.
 * @modules ERC1155Core
 * @example
 * ```ts
 * import { ERC1155Core } from "thirdweb/modules";
 *
 * const supported = ERC1155Core.isMintWithSignatureSupported(["0x..."]);
 * ```
 */
export function isMintWithSignatureSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "mintWithSignature" function.
 * @param options - The options for the mintWithSignature function.
 * @returns The encoded ABI parameters.
 * @modules ERC1155Core
 * @example
 * ```ts
 * import { ERC1155Core } from "thirdweb/modules";
 * const result = ERC1155Core.encodeMintWithSignatureParams({
 *  to: ...,
 *  tokenId: ...,
 *  amount: ...,
 *  baseURI: ...,
 *  data: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeMintWithSignatureParams(
  options: MintWithSignatureParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.tokenId,
    options.amount,
    options.baseURI,
    options.data,
    options.signature,
  ]);
}

/**
 * Encodes the "mintWithSignature" function into a Hex string with its parameters.
 * @param options - The options for the mintWithSignature function.
 * @returns The encoded hexadecimal string.
 * @modules ERC1155Core
 * @example
 * ```ts
 * import { ERC1155Core } from "thirdweb/modules";
 * const result = ERC1155Core.encodeMintWithSignature({
 *  to: ...,
 *  tokenId: ...,
 *  amount: ...,
 *  baseURI: ...,
 *  data: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeMintWithSignature(options: MintWithSignatureParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeMintWithSignatureParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "mintWithSignature" function on the contract.
 * @param options - The options for the "mintWithSignature" function.
 * @returns A prepared transaction object.
 * @modules ERC1155Core
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { ERC1155Core } from "thirdweb/modules";
 *
 * const transaction = ERC1155Core.mintWithSignature({
 *  contract,
 *  to: ...,
 *  tokenId: ...,
 *  amount: ...,
 *  baseURI: ...,
 *  data: ...,
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
export function mintWithSignature(
  options: BaseTransactionOptions<
    | MintWithSignatureParams
    | {
        asyncParams: () => Promise<MintWithSignatureParams>;
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
        resolvedOptions.to,
        resolvedOptions.tokenId,
        resolvedOptions.amount,
        resolvedOptions.baseURI,
        resolvedOptions.data,
        resolvedOptions.signature,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
