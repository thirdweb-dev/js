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
 * Represents the parameters for the "airdropERC20" function.
 */
export type AirdropERC20Params = WithOverrides<{
  tokenAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenAddress";
  }>;
  tokenOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenOwner";
  }>;
  contents: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "contents";
    components: [
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "amount" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x0670b2b3" as const;
const FN_INPUTS = [
  {
    name: "tokenAddress",
    type: "address",
  },
  {
    name: "tokenOwner",
    type: "address",
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `airdropERC20` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `airdropERC20` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isAirdropERC20Supported } from "thirdweb/extensions/erc20";
 *
 * const supported = isAirdropERC20Supported(["0x..."]);
 * ```
 */
export function isAirdropERC20Supported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "airdropERC20" function.
 * @param options - The options for the airdropERC20 function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeAirdropERC20Params } from "thirdweb/extensions/erc20";
 * const result = encodeAirdropERC20Params({
 *  tokenAddress: ...,
 *  tokenOwner: ...,
 *  contents: ...,
 * });
 * ```
 */
export function encodeAirdropERC20Params(options: AirdropERC20Params) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenAddress,
    options.tokenOwner,
    options.contents,
  ]);
}

/**
 * Encodes the "airdropERC20" function into a Hex string with its parameters.
 * @param options - The options for the airdropERC20 function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeAirdropERC20 } from "thirdweb/extensions/erc20";
 * const result = encodeAirdropERC20({
 *  tokenAddress: ...,
 *  tokenOwner: ...,
 *  contents: ...,
 * });
 * ```
 */
export function encodeAirdropERC20(options: AirdropERC20Params) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAirdropERC20Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "airdropERC20" function on the contract.
 * @param options - The options for the "airdropERC20" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { airdropERC20 } from "thirdweb/extensions/erc20";
 *
 * const transaction = airdropERC20({
 *  contract,
 *  tokenAddress: ...,
 *  tokenOwner: ...,
 *  contents: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function airdropERC20(
  options: BaseTransactionOptions<
    | AirdropERC20Params
    | {
        asyncParams: () => Promise<AirdropERC20Params>;
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
        resolvedOptions.tokenAddress,
        resolvedOptions.tokenOwner,
        resolvedOptions.contents,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
