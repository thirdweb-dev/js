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
 * Represents the parameters for the "openPack" function.
 */
export type OpenPackParams = WithOverrides<{
  packId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "packId" }>;
  amountToOpen: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "amountToOpen";
  }>;
}>;

export const FN_SELECTOR = "0x914e126a" as const;
const FN_INPUTS = [
  {
    name: "packId",
    type: "uint256",
  },
  {
    name: "amountToOpen",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "totalAmount",
        type: "uint256",
      },
    ],
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `openPack` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `openPack` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isOpenPackSupported } from "thirdweb/extensions/pack";
 *
 * const supported = isOpenPackSupported(["0x..."]);
 * ```
 */
export function isOpenPackSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "openPack" function.
 * @param options - The options for the openPack function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeOpenPackParams } from "thirdweb/extensions/pack";
 * const result = encodeOpenPackParams({
 *  packId: ...,
 *  amountToOpen: ...,
 * });
 * ```
 */
export function encodeOpenPackParams(options: OpenPackParams) {
  return encodeAbiParameters(FN_INPUTS, [options.packId, options.amountToOpen]);
}

/**
 * Encodes the "openPack" function into a Hex string with its parameters.
 * @param options - The options for the openPack function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeOpenPack } from "thirdweb/extensions/pack";
 * const result = encodeOpenPack({
 *  packId: ...,
 *  amountToOpen: ...,
 * });
 * ```
 */
export function encodeOpenPack(options: OpenPackParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOpenPackParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "openPack" function on the contract.
 * @param options - The options for the "openPack" function.
 * @returns A prepared transaction object.
 * @extension PACK
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { openPack } from "thirdweb/extensions/pack";
 *
 * const transaction = openPack({
 *  contract,
 *  packId: ...,
 *  amountToOpen: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function openPack(
  options: BaseTransactionOptions<
    | OpenPackParams
    | {
        asyncParams: () => Promise<OpenPackParams>;
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
      return [resolvedOptions.packId, resolvedOptions.amountToOpen] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
