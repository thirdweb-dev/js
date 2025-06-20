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
 * Represents the parameters for the "redeem" function.
 */
export type RedeemParams = WithOverrides<{
  shares: AbiParameterToPrimitiveType<{ type: "uint256"; name: "shares" }>;
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "receiver" }>;
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
}>;

export const FN_SELECTOR = "0xba087652" as const;
const FN_INPUTS = [
  {
    name: "shares",
    type: "uint256",
  },
  {
    name: "receiver",
    type: "address",
  },
  {
    name: "owner",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "assets",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `redeem` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `redeem` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isRedeemSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = isRedeemSupported(["0x..."]);
 * ```
 */
export function isRedeemSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "redeem" function.
 * @param options - The options for the redeem function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeRedeemParams } from "thirdweb/extensions/erc4626";
 * const result = encodeRedeemParams({
 *  shares: ...,
 *  receiver: ...,
 *  owner: ...,
 * });
 * ```
 */
export function encodeRedeemParams(options: RedeemParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.shares,
    options.receiver,
    options.owner,
  ]);
}

/**
 * Encodes the "redeem" function into a Hex string with its parameters.
 * @param options - The options for the redeem function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeRedeem } from "thirdweb/extensions/erc4626";
 * const result = encodeRedeem({
 *  shares: ...,
 *  receiver: ...,
 *  owner: ...,
 * });
 * ```
 */
export function encodeRedeem(options: RedeemParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRedeemParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "redeem" function on the contract.
 * @param options - The options for the "redeem" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { redeem } from "thirdweb/extensions/erc4626";
 *
 * const transaction = redeem({
 *  contract,
 *  shares: ...,
 *  receiver: ...,
 *  owner: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function redeem(
  options: BaseTransactionOptions<
    | RedeemParams
    | {
        asyncParams: () => Promise<RedeemParams>;
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
        resolvedOptions.shares,
        resolvedOptions.receiver,
        resolvedOptions.owner,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
