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
 * Represents the parameters for the "airdropERC20WithSignature" function.
 */
export type AirdropERC20WithSignatureParams = WithOverrides<{
  req: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "req";
    components: [
      { type: "bytes32"; name: "uid" },
      { type: "address"; name: "tokenAddress" },
      { type: "uint256"; name: "expirationTimestamp" },
      {
        type: "tuple[]";
        name: "contents";
        components: [
          { type: "address"; name: "recipient" },
          { type: "uint256"; name: "amount" },
        ];
      },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
}>;

export const FN_SELECTOR = "0xaaba07f6" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "uid",
        type: "bytes32",
      },
      {
        name: "tokenAddress",
        type: "address",
      },
      {
        name: "expirationTimestamp",
        type: "uint256",
      },
      {
        components: [
          {
            name: "recipient",
            type: "address",
          },
          {
            name: "amount",
            type: "uint256",
          },
        ],
        name: "contents",
        type: "tuple[]",
      },
    ],
    name: "req",
    type: "tuple",
  },
  {
    name: "signature",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `airdropERC20WithSignature` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `airdropERC20WithSignature` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isAirdropERC20WithSignatureSupported } from "thirdweb/extensions/airdrop";
 *
 * const supported = isAirdropERC20WithSignatureSupported(["0x..."]);
 * ```
 */
export function isAirdropERC20WithSignatureSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "airdropERC20WithSignature" function.
 * @param options - The options for the airdropERC20WithSignature function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeAirdropERC20WithSignatureParams } from "thirdweb/extensions/airdrop";
 * const result = encodeAirdropERC20WithSignatureParams({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeAirdropERC20WithSignatureParams(
  options: AirdropERC20WithSignatureParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.req, options.signature]);
}

/**
 * Encodes the "airdropERC20WithSignature" function into a Hex string with its parameters.
 * @param options - The options for the airdropERC20WithSignature function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeAirdropERC20WithSignature } from "thirdweb/extensions/airdrop";
 * const result = encodeAirdropERC20WithSignature({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeAirdropERC20WithSignature(
  options: AirdropERC20WithSignatureParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAirdropERC20WithSignatureParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "airdropERC20WithSignature" function on the contract.
 * @param options - The options for the "airdropERC20WithSignature" function.
 * @returns A prepared transaction object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { airdropERC20WithSignature } from "thirdweb/extensions/airdrop";
 *
 * const transaction = airdropERC20WithSignature({
 *  contract,
 *  req: ...,
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
export function airdropERC20WithSignature(
  options: BaseTransactionOptions<
    | AirdropERC20WithSignatureParams
    | {
        asyncParams: () => Promise<AirdropERC20WithSignatureParams>;
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
      return [resolvedOptions.req, resolvedOptions.signature] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
