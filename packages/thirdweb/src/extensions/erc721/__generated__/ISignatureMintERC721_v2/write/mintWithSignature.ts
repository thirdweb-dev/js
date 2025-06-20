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
  payload: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "payload";
    components: [
      { type: "address"; name: "to" },
      { type: "address"; name: "royaltyRecipient" },
      { type: "uint256"; name: "royaltyBps" },
      { type: "address"; name: "primarySaleRecipient" },
      { type: "string"; name: "uri" },
      { type: "uint256"; name: "quantity" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
      { type: "uint128"; name: "validityStartTimestamp" },
      { type: "uint128"; name: "validityEndTimestamp" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
}>;

export const FN_SELECTOR = "0x439c7be5" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "royaltyRecipient",
        type: "address",
      },
      {
        name: "royaltyBps",
        type: "uint256",
      },
      {
        name: "primarySaleRecipient",
        type: "address",
      },
      {
        name: "uri",
        type: "string",
      },
      {
        name: "quantity",
        type: "uint256",
      },
      {
        name: "pricePerToken",
        type: "uint256",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "validityStartTimestamp",
        type: "uint128",
      },
      {
        name: "validityEndTimestamp",
        type: "uint128",
      },
      {
        name: "uid",
        type: "bytes32",
      },
    ],
    name: "payload",
    type: "tuple",
  },
  {
    name: "signature",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "signer",
    type: "address",
  },
] as const;

/**
 * Checks if the `mintWithSignature` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `mintWithSignature` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isMintWithSignatureSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isMintWithSignatureSupported(["0x..."]);
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
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeMintWithSignatureParams } from "thirdweb/extensions/erc721";
 * const result = encodeMintWithSignatureParams({
 *  payload: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeMintWithSignatureParams(
  options: MintWithSignatureParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.payload, options.signature]);
}

/**
 * Encodes the "mintWithSignature" function into a Hex string with its parameters.
 * @param options - The options for the mintWithSignature function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeMintWithSignature } from "thirdweb/extensions/erc721";
 * const result = encodeMintWithSignature({
 *  payload: ...,
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
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { mintWithSignature } from "thirdweb/extensions/erc721";
 *
 * const transaction = mintWithSignature({
 *  contract,
 *  payload: ...,
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
      return [resolvedOptions.payload, resolvedOptions.signature] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
